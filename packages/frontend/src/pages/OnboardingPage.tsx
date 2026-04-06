import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api, API_BASE_URL } from '../lib/api-client';
import {
  Dices,
  Eye,
  Square,
  SmilePlus,
  Radio,
  Antenna,
  Layers,
  Palette,
  Check,
  X,
  Loader2,
} from 'lucide-react';

// ─── Bottts option sets ────────────────────────────────────────────────────────
const EYES_OPTIONS = [
  'bulging',
  'dizzy',
  'eva',
  'frame1',
  'frame2',
  'glow',
  'happy',
  'hearts',
  'robocop',
  'round',
  'roundFrame01',
  'roundFrame02',
  'sensor',
  'shade01',
] as const;
const FACE_OPTIONS = [
  'round01',
  'round02',
  'square01',
  'square02',
  'square03',
  'square04',
] as const;
const MOUTH_OPTIONS = [
  'bite',
  'diagram',
  'grill01',
  'grill02',
  'grill03',
  'smile01',
  'smile02',
  'square01',
  'square02',
] as const;
const SIDES_OPTIONS = [
  'antenna01',
  'antenna02',
  'cables01',
  'cables02',
  'round',
  'square',
  'squareAssymetric',
] as const;
const TOP_OPTIONS = [
  'antenna',
  'antennaCrooked',
  'bulb01',
  'glowingBulb01',
  'glowingBulb02',
  'horns',
  'lights',
  'pyramid',
  'radar',
] as const;
const TEXTURE_OPTIONS = [
  'camo01',
  'camo02',
  'circuits',
  'dirty01',
  'dirty02',
  'dots',
  'grunge01',
  'grunge02',
] as const;
const BASE_COLORS = [
  '00acc1',
  '1e88e5',
  '5e35b1',
  '7cb342',
  '8e24aa',
  '039be5',
  '43a047',
  '00897b',
  '3949ab',
  'd81b60',
  'e53935',
  'f4511e',
  'fb8c00',
  'ffb300',
] as const;

type EyesOption = typeof EYES_OPTIONS[number];
type FaceOption = typeof FACE_OPTIONS[number];
type MouthOption = typeof MOUTH_OPTIONS[number];
type SidesOption = typeof SIDES_OPTIONS[number];
type TopOption = typeof TOP_OPTIONS[number];
type TextureOption = typeof TEXTURE_OPTIONS[number];

function randomFrom<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
function randomSeed() {
  return Math.random().toString(36).substring(2, 15);
}

// ─── Types for each button config ────────────────────────────────────────────
type RandomBtn = {
  id: string;
  label: string;
  desc: string;
  icon: React.ReactNode;
  action: () => void;
};

/**
 * Onboarding page - username and avatar setup.
 */
export function OnboardingPage() {
  const { refreshUser } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');

  // Bottts state
  const [seed, setSeed] = useState(randomSeed);
  const [eyes, setEyes] = useState<EyesOption>(randomFrom(EYES_OPTIONS));
  const [face, setFace] = useState<FaceOption>(randomFrom(FACE_OPTIONS));
  const [mouth, setMouth] = useState<MouthOption>(randomFrom(MOUTH_OPTIONS));
  const [sides, setSides] = useState<SidesOption>(randomFrom(SIDES_OPTIONS));
  const [top, setTop] = useState<TopOption>(randomFrom(TOP_OPTIONS));
  const [texture, setTexture] = useState<TextureOption>(randomFrom(TEXTURE_OPTIONS));
  const [baseColor, setBaseColor] = useState<string>(randomFrom(BASE_COLORS));

  const [avatarSvg, setAvatarSvg] = useState('');
  const [usernameStatus, setUsernameStatus] = useState<
    'idle' | 'checking' | 'available' | 'taken'
  >('idle');
  const [submitting, setSubmitting] = useState(false);

  const checkTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Fetch avatar whenever any param changes
  useEffect(() => {
    const params = new URLSearchParams({ seed, eyes, face, mouth, sides, top, texture, baseColor });
    fetch(`${API_BASE_URL}/api/avatar?${params}`)
      .then((res) => res.text())
      .then((svg) => setAvatarSvg(svg))
      .catch((err) => console.error('Failed to fetch avatar:', err));
  }, [seed, eyes, face, mouth, sides, top, texture, baseColor]);

  // ── Randomise helpers ────────────────────────────────────────────────────────
  const randomizeAll = () => {
    setSeed(randomSeed());
    setEyes(randomFrom(EYES_OPTIONS));
    setFace(randomFrom(FACE_OPTIONS));
    setMouth(randomFrom(MOUTH_OPTIONS));
    setSides(randomFrom(SIDES_OPTIONS));
    setTop(randomFrom(TOP_OPTIONS));
    setTexture(randomFrom(TEXTURE_OPTIONS));
    setBaseColor(randomFrom(BASE_COLORS));
  };

  const buttons: RandomBtn[] = [
    {
      id: 'btn-randomize-all',
      label: 'All',
      desc: 'Randomize everything',
      icon: <Dices className="w-4 h-4" />,
      action: randomizeAll,
    },
    {
      id: 'btn-randomize-eyes',
      label: 'Eyes',
      desc: 'Randomize eyes',
      icon: <Eye className="w-4 h-4" />,
      action: () => setEyes(randomFrom(EYES_OPTIONS)),
    },
    {
      id: 'btn-randomize-face',
      label: 'Face',
      desc: 'Randomize face shape',
      icon: <Square className="w-4 h-4" />,
      action: () => setFace(randomFrom(FACE_OPTIONS)),
    },
    {
      id: 'btn-randomize-mouth',
      label: 'Mouth',
      desc: 'Randomize mouth',
      icon: <SmilePlus className="w-4 h-4" />,
      action: () => setMouth(randomFrom(MOUTH_OPTIONS)),
    },
    {
      id: 'btn-randomize-sides',
      label: 'Sides',
      desc: 'Randomize side accessories',
      icon: <Radio className="w-4 h-4" />,
      action: () => setSides(randomFrom(SIDES_OPTIONS)),
    },
    {
      id: 'btn-randomize-top',
      label: 'Top',
      desc: 'Randomize top attachment',
      icon: <Antenna className="w-4 h-4" />,
      action: () => setTop(randomFrom(TOP_OPTIONS)),
    },
    {
      id: 'btn-randomize-texture',
      label: 'Skin',
      desc: 'Randomize body texture',
      icon: <Layers className="w-4 h-4" />,
      action: () => setTexture(randomFrom(TEXTURE_OPTIONS)),
    },
    {
      id: 'btn-randomize-color',
      label: 'Color',
      desc: 'Randomize base color',
      icon: <Palette className="w-4 h-4" />,
      action: () => setBaseColor(randomFrom(BASE_COLORS)),
    },
  ];

  // ── Username check ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!username) {
      setUsernameStatus('idle');
      return;
    }
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    if (!usernameRegex.test(username)) {
      setUsernameStatus('idle');
      return;
    }

    setUsernameStatus('checking');
    if (checkTimeoutRef.current) clearTimeout(checkTimeoutRef.current);

    checkTimeoutRef.current = setTimeout(async () => {
      try {
        const data = await api.get<{ available: boolean }>(`/api/users/check-username?username=${encodeURIComponent(username)}`);
        setUsernameStatus(data.available ? 'available' : 'taken');
      } catch {
        setUsernameStatus('idle');
      }
    }, 300);

    return () => {
      if (checkTimeoutRef.current) clearTimeout(checkTimeoutRef.current);
    };
  }, [username]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (usernameStatus !== 'available' || !name.trim() || submitting) return;
    setSubmitting(true);
    try {
      await api.post('/api/users', {
        name: name.trim(),
        username,
        avatarSvg,
      });

      // Refresh user session
      await refreshUser();
      navigate('/problems');
    } catch (error) {
      alert('Failed to create profile');
      setSubmitting(false);
    }
  };

  const isValid = usernameStatus === 'available' && name.trim().length > 0;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 font-mono">
      <div className="w-full max-w-md bg-card border border-border rounded-lg p-8 shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-emerald-400 mb-2">Welcome to codetracer</h1>
          <p className="text-muted-foreground">Set up your profile to get started</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar Preview + Controls */}
          <div className="flex flex-col items-center space-y-4">
            {/* Avatar */}
            <div
              className="w-28 h-28 rounded-full overflow-hidden border-2 border-emerald-500/30 bg-muted"
              dangerouslySetInnerHTML={{ __html: avatarSvg }}
            />

            {/* Randomise buttons */}
            <div className="w-full">
              <p className="text-xs text-muted-foreground text-center mb-2 uppercase tracking-widest">
                Customize your bot
              </p>
              <div className="grid grid-cols-4 gap-2">
                {buttons.map((btn) => (
                  <button
                    key={btn.id}
                    id={btn.id}
                    type="button"
                    onClick={btn.action}
                    title={btn.desc}
                    className="flex flex-col items-center gap-1 py-2 px-1 bg-muted hover:bg-zinc-700 border border-border hover:border-emerald-500/50 rounded transition-all group"
                  >
                    <span className="text-emerald-400 group-hover:scale-110 transition-transform">
                      {btn.icon}
                    </span>
                    <span className="text-muted-foreground text-[10px] leading-none">{btn.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-muted-foreground mb-2">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 bg-muted border border-border rounded text-foreground focus:outline-none focus:border-emerald-500 transition-colors"
              required
            />
          </div>

          {/* Username Field */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-muted-foreground mb-2">
              Username
            </label>
            <div className="relative">
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 pr-10 bg-muted border border-border rounded text-foreground focus:outline-none focus:border-emerald-500 transition-colors"
                placeholder="3-20 characters, alphanumeric and _"
                required
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {usernameStatus === 'checking' && (
                  <Loader2 className="w-5 h-5 text-muted-foreground animate-spin" />
                )}
                {usernameStatus === 'available' && <Check className="w-5 h-5 text-primary" />}
                {usernameStatus === 'taken' && <X className="w-5 h-5 text-red-500" />}
              </div>
            </div>
            {usernameStatus === 'taken' && (
              <p className="text-sm text-red-400 mt-1">Username is already taken</p>
            )}
            {username && !/^[a-zA-Z0-9_]{3,20}$/.test(username) && (
              <p className="text-sm text-muted-foreground mt-1">
                Must be 3-20 characters, alphanumeric and underscore only
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            id="btn-complete-setup"
            type="submit"
            disabled={!isValid || submitting}
            className="w-full py-3 bg-primary hover:bg-emerald-700 disabled:bg-zinc-700 disabled:text-muted-foreground text-white font-semibold rounded transition-colors disabled:cursor-not-allowed"
          >
            {submitting ? 'Setting up...' : 'Complete Setup'}
          </button>
        </form>
      </div>
    </div>
  );
}
