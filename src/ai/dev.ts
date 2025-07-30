import { config } from 'dotenv';
config();

import '@/ai/flows/diagnose-plant-from-image.ts';
import '@/ai/flows/diagnose-plant-from-symptoms.ts';
import '@/ai/flows/recommend-medication.ts';
import '@/ai/flows/identify-insect-from-image.ts';
