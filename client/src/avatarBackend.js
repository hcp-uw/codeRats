import { supabase } from "../lib/supabase";

const TABLE = "avatar";

function assertFiniteNumber(value, fieldName) {
  const n = Number(value);
  if (!Number.isFinite(n)) {
    throw new Error(`${fieldName} must be a finite number`);
  }
  return n;
}

export async function createAvatar({
  user_id,
  level = 1,
  health = 100,
  strength = 10,
  coins = 0,
}) {
  if (user_id === undefined || user_id === null) {
    throw new Error("user_id is required");
  }

  const levelNum = assertFiniteNumber(level, "level");
  const healthNum = assertFiniteNumber(health, "health");
  const strengthNum = assertFiniteNumber(strength, "strength");
  const coinsNum = assertFiniteNumber(coins, "coins");

  const { data, error } = await supabase
    .from(TABLE)
    .insert({
      user_id,
      level: levelNum,
      health: healthNum,
      strength: strengthNum,
      coins: coinsNum,
    })
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function getAvatarByUser(user_id) {
  if (user_id === undefined || user_id === null) {
    throw new Error("user_id is required");
  }

  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("user_id", user_id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data ?? null;
}

export async function updateAvatarByUser(user_id, patch) {
  if (user_id === undefined || user_id === null) {
    throw new Error("user_id is required");
  }

  const updateObj = {};

  if (patch.level !== undefined) {
    updateObj.level = assertFiniteNumber(patch.level, "level");
  }
  if (patch.health !== undefined) {
    updateObj.health = assertFiniteNumber(patch.health, "health");
  }
  if (patch.strength !== undefined) {
    updateObj.strength = assertFiniteNumber(patch.strength, "strength");
  }
  if (patch.coins !== undefined) {
    updateObj.coins = assertFiniteNumber(patch.coins, "coins");
  }

  const { data, error } = await supabase
    .from(TABLE)
    .update(updateObj)
    .eq("user_id", user_id)
    .select("*")
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data ?? null;
}