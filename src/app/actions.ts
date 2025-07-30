'use server';

import { diagnosePlantFromImage, DiagnosePlantFromImageOutput } from '@/ai/flows/diagnose-plant-from-image';
import { diagnosePlantFromSymptoms, DiagnosePlantFromSymptomsOutput } from '@/ai/flows/diagnose-plant-from-symptoms';
import { identifyInsectFromImage, IdentifyInsectFromImageOutput } from '@/ai/flows/identify-insect-from-image';


export type DiagnosisResultType = DiagnosePlantFromImageOutput | DiagnosePlantFromSymptomsOutput | IdentifyInsectFromImageOutput;

type ActionState<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

export async function handleImageDiagnosis(photoDataUri: string): Promise<ActionState<DiagnosePlantFromImageOutput>> {
  try {
    if (!photoDataUri) {
      return { success: false, error: 'Image data is missing.' };
    }
    const result = await diagnosePlantFromImage({ photoDataUri });
    return { success: true, data: result };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : 'An unexpected error occurred.';
    return { success: false, error: `Failed to diagnose from image. ${errorMessage}` };
  }
}

export async function handleSymptomDiagnosis(symptoms: string): Promise<ActionState<DiagnosePlantFromSymptomsOutput>> {
  try {
    if (!symptoms || symptoms.trim().length === 0) {
        return { success: false, error: 'Symptoms description is empty.' };
    }
    const result = await diagnosePlantFromSymptoms({ symptoms });
    return { success: true, data: result };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : 'An unexpected error occurred.';
    return { success: false, error: `Failed to diagnose from symptoms. ${errorMessage}` };
  }
}

export async function handleInsectIdentification(photoDataUri: string): Promise<ActionState<IdentifyInsectFromImageOutput>> {
  try {
    if (!photoDataUri) {
      return { success: false, error: 'Image data is missing.' };
    }
    const result = await identifyInsectFromImage({ photoDataUri });
    return { success: true, data: result };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : 'An unexpected error occurred.';
    return { success: false, error: `Failed to identify insect. ${errorMessage}` };
  }
}
