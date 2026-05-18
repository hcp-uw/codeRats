import { supabase } from "../lib/supabase";

const TABLE = "goal";

// "Enum" Status has three possible values
const Status = Object.freeze({
  active: "active",
  completed: "completed",
  abandoned: "abandoned",
});

function assertNonEmptyString(value, fieldName) {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${fieldName} must be a non-empty string`);
  }
}

export async function createGoal({ goal_name, goal_desc = null, end_date = null, icon = null, user_id }) {
  assertNonEmptyString(goal_name, "goal_name");

  if (user_id === undefined || user_id === null) {
    throw new Error("user_id is required");
  }

  const { data, error } = await supabase
    .from(TABLE)
    .insert({
      goal_name: goal_name.trim(),
      goal_desc: goal_desc?.trim(),
      end_date,
      icon,
      user_id,
    })
    .select("*") // Return the inserted row
    .single(); // Check that only one row is inserted

  if (error) throw new Error(error.message);
  return data;
}

export async function updateGoal(goal_id, patch) {
  if (goal_id === undefined || goal_id === null) {
    throw new Error("goal_id is required");
  }

  const updateObj = {};
  if (patch.goal_name !== undefined) {
    assertNonEmptyString(patch.goal_name, "goal_name");
    updateObj.goal_name = patch.goal_name.trim();
  }
  if (patch.goal_desc !== undefined) {
    updateObj.goal_desc = patch.goal_desc.trim();
  }
  if (patch.icon !== undefined) {
    updateObj.icon = patch.icon.trim();
  }
  if (patch.end_date !== undefined) {
    updateObj.end_date = patch.end_date;
  }
  if (patch.status !== undefined) {
    if (!Object.values(Status).includes(patch.status)) {
      throw new Error("Invalid status value");
    }
    updateObj.status = patch.status;
  }

  const { data, error } = await supabase
    .from(TABLE)
    .update(updateObj)
    .eq("goal_id", goal_id)
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return data ?? null;
}

export async function getGoalsByUser(user_id) {
  if (user_id === undefined || user_id === null) {
    throw new Error("user_id is required");
  }

  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("user_id", user_id)
    .order('end_date', { ascending: false, nullsFirst: false })

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function deleteGoal(goal_id) {
  if (goal_id === undefined || goal_id === null) {
    throw new Error("goal_id is required");
  }

  const { error, count } = await supabase
    .from(TABLE)
    .delete({ count: "exact" })
    .eq("goal_id", goal_id);

  if (error) throw new Error(error.message);
  return (count ?? 0) == 1;
}