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

export async function createTask({ task_name, duration, start_time = null, user_id }) {
  assertNonEmptyString(task_name, "task_name");
  const durationNum = assertFiniteNumber(duration, "duration");

  if (user_id === undefined || user_id === null) {
    throw new Error("user_id is required");
  }

  const { data, error } = await supabase
    .from(TABLE)
    .insert({
      task_name: task_name.trim(),
      duration: durationNum,
      start_time,
      user_id,
    })
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
  if (patch.duration !== undefined) {
    updateObj.duration = assertFiniteNumber(patch.duration, "duration");
  }
  if (patch.start_time !== undefined) {
    updateObj.start_time = patch.start_time;
  }

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

export async function createTaskFromWorkoutForm({ title, duration, date, time, user_id }) {
  const start_time = combineDateTimeToISO(date, time);
  return createTask({
    task_name: title,
    duration,
    start_time,
    user_id,
  });
}