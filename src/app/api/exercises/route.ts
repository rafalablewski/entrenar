import { NextRequest, NextResponse } from "next/server";
import { allExercises, getExercisesByCategory, searchExercises } from "@/lib/exercises";

export async function GET(req: NextRequest) {
  const category = req.nextUrl.searchParams.get("category");
  const query = req.nextUrl.searchParams.get("q");

  let exercises = allExercises;

  if (category) {
    exercises = getExercisesByCategory(category);
  }

  if (query) {
    exercises = searchExercises(query);
    if (category) {
      exercises = exercises.filter((e) => e.category === category);
    }
  }

  return NextResponse.json({
    exercises,
    total: exercises.length,
    totalLibrary: allExercises.length,
  });
}
