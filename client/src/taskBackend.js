import { supabase } from "../lib/supabase";

const TABLE = "task";

function assertNonEmptyString(value, fieldName) {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${fieldName} must be a non-empty string`);
  }
}

function assertFiniteNumber(value, fieldName) {
  const n = Number(value);
  if (!Number.isFinite(n)) {
    throw new Error(`${fieldName} must be a finite number`);
  }
  return n;
}

function combineDateTimeToISO(dateStr, timeStr) {
  if (!dateStr || !timeStr) return null;

  // dateStr is "YYYY-MM-DD", timeStr is "HH:MM"
  // This safely parses them as a local time instead of UTC
  const [year, month, day] = dateStr.split('-').map(Number);
  const [hours, minutes] = timeStr.split(':').map(Number);

  // Months are 0-indexed in JS Date constructors
  const localDate = new Date(year, month - 1, day, hours, minutes);

  // Returns a fully-qualified UTC ISO string (e.g., "2026-05-17T06:13:00.000Z")
  return localDate.toISOString();
}

export async function createTask({
  task_name,
  description = null,
  activity_type = null,
  duration,
  start_time = null,
  distance = null,
  muscle_groups = null,
  exercise = null,
  weight = null,
  set_reps = null,
  user_id,
}) {
  assertNonEmptyString(task_name, "task_name");
  const durationNum = assertFiniteNumber(duration, "duration");

  if (user_id === undefined || user_id === null) {
    throw new Error("user_id is required");
  }

  const row = {
    task_name: task_name.trim(),
    description: description ?? null,
    activity_type: activity_type ?? null,
    duration: durationNum,
    start_time,
    user_id,
  };

  // run-specific fields
  if (activity_type === "run") {
    row.distance = distance !== null ? assertFiniteNumber(distance, "distance") : null;
  }

  // weight lift-specific fields
  if (activity_type === "weight_lift") {
    row.muscle_groups = muscle_groups ?? null;
    row.exercise = exercise ?? null;
    row.weight = weight !== null ? assertFiniteNumber(weight, "weight") : null;
    row.set_reps = set_reps ?? null;
  }

  const { data, error } = await supabase
    .from(TABLE)
    .insert(row)
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function getTasksByUser(user_id) {
  if (user_id === undefined || user_id === null) {
    throw new Error("user_id is required");
  }

  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("user_id", user_id)
    .order("start_time", { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function updateTask(task_id, patch) {
  if (task_id === undefined || task_id === null) {
    throw new Error("task_id is required");
  }

  const updateObj = {};
  if (patch.task_name !== undefined) {
    assertNonEmptyString(patch.task_name, "task_name");
    updateObj.task_name = patch.task_name.trim();
  }
  if (patch.description !== undefined) updateObj.description = patch.description;
  if (patch.activity_type !== undefined) updateObj.activity_type = patch.activity_type;
  if (patch.duration !== undefined) {
    updateObj.duration = assertFiniteNumber(patch.duration, "duration");
  }
  if (patch.start_time !== undefined) updateObj.start_time = patch.start_time;
  if (patch.distance !== undefined) {
    updateObj.distance = patch.distance !== null ? assertFiniteNumber(patch.distance, "distance") : null;
  }
  if (patch.muscle_groups !== undefined) updateObj.muscle_groups = patch.muscle_groups;
  if (patch.exercise !== undefined) updateObj.exercise = patch.exercise;
  if (patch.weight !== undefined) {
    updateObj.weight = patch.weight !== null ? assertFiniteNumber(patch.weight, "weight") : null;
  }
  if (patch.set_reps !== undefined) updateObj.set_reps = patch.set_reps;

  const { data, error } = await supabase
    .from(TABLE)
    .update(updateObj)
    .eq("task_id", task_id)
    .select("*")
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data ?? null;
}

export async function deleteTask(task_id) {
  const { error, count } = await supabase
    .from(TABLE)
    .delete({ count: "exact" })
    .eq("task_id", task_id);

  if (error) throw new Error(error.message);
  return (count ?? 0) > 0;
}

export async function createTaskFromWorkoutForm({
  title,
  description,
  activity_type,
  date,
  time,
  duration,
  // run
  distance,
  // weight lift
  muscle_groups,
  exercise,
  weight,
  set_reps,
  user_id,
}) {
  assertNonEmptyString(title, "title");
  assertNonEmptyString(activity_type, "activity_type");
  assertNonEmptyString(user_id, "user_id");

  // This creates your clean "YYYY-MM-DDTHH:MM:00.000" local string snippet
  const isoStr = combineDateTimeToISO(date, time); 

  const insertObj = {
    task_name: title,
    description: description || null,
    activity_type,
    duration: duration !== undefined && duration !== null ? assertFiniteNumber(duration, "duration") : null,
    distance: distance !== undefined && distance !== null ? assertFiniteNumber(distance, "distance") : null,
    muscle_groups: muscle_groups || null,
    exercise: exercise || null,
    weight: weight !== undefined && weight !== null ? assertFiniteNumber(weight, "weight") : null,
    set_reps: set_reps || null,
    user_id,
    // CRITICAL: Send the clean isoStr text directly! Do not wrap it in new Date()
    start_time: isoStr, 
  };
  
  const { data, error } = await supabase
    .from(TABLE)
    .insert([insertObj])
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function rewardUserCoins(user_id, amount = 10) {
  if (!user_id) throw new Error("user_id is required to reward coins");

  const { error } = await supabase
    .rpc('increment_coins', { target_user_id: user_id, amount: amount });

  if (error) throw new Error(`Failed to update coins: ${error.message}`);
}


/**
 * Deducts coins from a user's avatar row when a workout is removed
 * @param {string} user_id - The authenticated UUID of the user
 * @param {number} amount - Amount of coins to remove (default 10)
 */
export async function deductUserCoins(user_id, amount = 10) {
  if (!user_id) throw new Error("user_id is required to deduct coins");

  // Reuses our secure RPC tracking, passing a negative amount to subtract balances cleanly
  const { error } = await supabase
    .rpc('increment_coins', { target_user_id: user_id, amount: -amount });

  if (error) throw new Error(`Failed to decrement coins: ${error.message}`);
}