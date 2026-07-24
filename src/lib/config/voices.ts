/**
 * Mock voice catalog used while VOICE_PROVIDER=mock (default, see .env.example).
 * Swapping in a real provider (ElevenLabs, etc.) means adding adapters under
 * lib/providers/voice/*, not changing this list's shape — id/name/description
 * is the stable contract the character form and voice picker rely on.
 */
export interface VoiceOption {
  id: string;
  name: string;
  description: string;
  gender: "feminine" | "masculine" | "neutral";
}

export const MOCK_VOICES: VoiceOption[] = [
  {
    id: "mock-warm-1",
    name: "Chaleureuse",
    description: "Douce et rassurante",
    gender: "feminine",
  },
  { id: "mock-playful-1", name: "Espiègle", description: "Vive et joueuse", gender: "feminine" },
  { id: "mock-deep-1", name: "Grave", description: "Posée et imposante", gender: "masculine" },
  {
    id: "mock-energetic-1",
    name: "Énergique",
    description: "Dynamique et enjouée",
    gender: "masculine",
  },
  { id: "mock-soft-1", name: "Douce", description: "Calme et posée", gender: "neutral" },
  {
    id: "mock-comedic-1",
    name: "Comique",
    description: "Exagérée et théâtrale",
    gender: "neutral",
  },
];

export function getVoiceOption(id: string | null): VoiceOption | undefined {
  if (!id) return undefined;
  return MOCK_VOICES.find((v) => v.id === id);
}
