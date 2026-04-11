import { supabase } from "../lib/supabase";

const GOALS_TABLE = 'user_goals'
const GOAL_TABLE = 'goal'

export async function setGoal({ goal_name, end_date = null, user_id }) {
    // if goal found, modify
    
    // else make new
}

export async function getGoal() {

}