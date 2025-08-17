"use server";

import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import type { SummarizeIntentOutput } from "@/ai/flows/intent-summarization";

export async function saveInsight(insight: SummarizeIntentOutput) {
  try {
    const docRef = await addDoc(collection(db, "insights"), {
      ...insight,
      createdAt: serverTimestamp(),
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error adding document: ", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return { success: false, error: errorMessage };
  }
}
