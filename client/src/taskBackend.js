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

function combineDateTimeToISO(date, time) {
  if (!date && !time) return null;

  if (typeof date === "string" && date.includes("T")) {
    const parsed = Date.parse(date);
    if (!Number.isNaN(parsed)) return new Date(parsed).toISOString();
  }

  if (!date) throw new Error("date is required if time is provided");
  if (!time) throw new Error("time is required if date is provided");

  const [yyyy, mm, dd] = date.split("-").map(Number);
  const [hh, min] = time.split(":").map(Number);

  const local = new Date(yyyy, mm - 1, dd, hh, min, 0);
  if (Number.isNaN(local.getTime())) {
    throw new Error("Invalid date/time format. Use YYYY-MM-DD and HH:MM");
  }
  return local.toISOString();
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
  sets_reps = null,
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
    row.sets_reps = sets_reps ?? null;
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
  if (patch.sets_reps !== undefined) updateObj.sets_reps = patch.sets_reps;

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
  sets_reps,
  user_id,
}) {
  const start_time = combineDateTimeToISO(date, time);
  return createTask({
    task_name: title,
    description,
    activity_type,
    duration,
    start_time,
    distance,
    muscle_groups,
    exercise,
    weight,
    sets_reps,
    user_id,
  });
}