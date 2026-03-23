export interface MuscleDetail {
  name: string;
  scientificName: string;
  role: "primary" | "secondary" | "stabilizer";
  layer: "superficial" | "deep" | "core";
  origin?: string;
  insertion?: string;
  innervation?: string;
  action?: string;
}

export interface ExerciseTemplate {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  description: string;
  detailedDescription?: string;
  muscleGroups: string[];
  muscles: MuscleDetail[];
  equipment: string[];
  difficulty: "beginner" | "intermediate" | "advanced" | "elite";
  movementPattern: string;
  plane: "sagittal" | "frontal" | "transverse" | "multi-planar";
  forceType: "push" | "pull" | "isometric" | "dynamic" | "ballistic" | "compound";
  joints: string[];
}

export const runningExercises: ExerciseTemplate[] = [
  {
    id: "run-easy", name: "Easy Run", category: "running", subcategory: "endurance",
    description: "Low-intensity aerobic run at conversational pace",
    detailedDescription: "An easy run is performed at 60-70% of maximum heart rate, primarily targeting aerobic energy systems. This effort level promotes capillary density in slow-twitch muscle fibers and enhances mitochondrial function for improved oxygen utilization.",
    muscleGroups: ["quads", "hamstrings", "calves", "glutes"],
    muscles: [
      { name: "Quadriceps", scientificName: "Quadriceps femoris", role: "primary", layer: "superficial", origin: "Anterior inferior iliac spine & upper femur", insertion: "Tibial tuberosity via patellar tendon", innervation: "Femoral nerve (L2-L4)", action: "Knee extension, hip flexion" },
      { name: "Hamstrings", scientificName: "Biceps femoris, Semimembranosus, Semitendinosus", role: "primary", layer: "superficial", origin: "Ischial tuberosity", insertion: "Fibular head (biceps), medial tibial condyle (semi)", innervation: "Sciatic nerve (L5-S2)", action: "Knee flexion, hip extension" },
      { name: "Gastrocnemius", scientificName: "Gastrocnemius", role: "primary", layer: "superficial", origin: "Medial & lateral femoral condyles", insertion: "Calcaneus via Achilles tendon", innervation: "Tibial nerve (S1-S2)", action: "Plantarflexion, knee flexion" },
      { name: "Soleus", scientificName: "Soleus", role: "secondary", layer: "deep", origin: "Posterior tibia & fibula", insertion: "Calcaneus via Achilles tendon", innervation: "Tibial nerve (S1-S2)", action: "Plantarflexion" },
      { name: "Gluteus Maximus", scientificName: "Gluteus maximus", role: "primary", layer: "superficial", origin: "Ilium, sacrum, coccyx", insertion: "Gluteal tuberosity, iliotibial tract", innervation: "Inferior gluteal nerve (L5-S2)", action: "Hip extension, external rotation" },
      { name: "Iliopsoas", scientificName: "Iliacus & Psoas major", role: "secondary", layer: "deep", origin: "T12-L5 vertebrae (psoas), iliac fossa (iliacus)", insertion: "Lesser trochanter of femur", innervation: "Femoral nerve & lumbar plexus", action: "Hip flexion" },
      { name: "Transversus Abdominis", scientificName: "Transversus abdominis", role: "stabilizer", layer: "deep", origin: "Iliac crest, inguinal ligament, thoracolumbar fascia", insertion: "Linea alba, pubic crest", innervation: "Thoracoabdominal nerves (T7-T12)", action: "Core stabilization, compression of abdominal contents" },
    ],
    equipment: [], difficulty: "beginner", movementPattern: "gait-cycle", plane: "sagittal", forceType: "dynamic", joints: ["hip", "knee", "ankle"],
  },
  {
    id: "run-recovery", name: "Recovery Run", category: "running", subcategory: "recovery",
    description: "Very easy effort to promote blood flow and recovery",
    muscleGroups: ["quads", "hamstrings", "calves"],
    muscles: [
      { name: "Quadriceps", scientificName: "Quadriceps femoris", role: "primary", layer: "superficial", origin: "Anterior inferior iliac spine & upper femur", insertion: "Tibial tuberosity", innervation: "Femoral nerve (L2-L4)", action: "Knee extension" },
      { name: "Gastrocnemius", scientificName: "Gastrocnemius", role: "primary", layer: "superficial", origin: "Medial & lateral femoral condyles", insertion: "Calcaneus via Achilles tendon", innervation: "Tibial nerve (S1-S2)", action: "Plantarflexion" },
      { name: "Hamstrings", scientificName: "Biceps femoris group", role: "secondary", layer: "superficial", origin: "Ischial tuberosity", insertion: "Fibular head & medial tibia", innervation: "Sciatic nerve (L5-S2)", action: "Knee flexion, hip extension" },
    ],
    equipment: [], difficulty: "beginner", movementPattern: "gait-cycle", plane: "sagittal", forceType: "dynamic", joints: ["hip", "knee", "ankle"],
  },
  {
    id: "run-long", name: "Long Run", category: "running", subcategory: "endurance",
    description: "Extended distance run building aerobic base",
    detailedDescription: "The long run develops the aerobic system by increasing mitochondrial density, capillary networks, and glycogen storage capacity. Engages all major leg muscles with significant core recruitment for postural maintenance over extended duration.",
    muscleGroups: ["quads", "hamstrings", "calves", "glutes", "core"],
    muscles: [
      { name: "Gluteus Maximus", scientificName: "Gluteus maximus", role: "primary", layer: "superficial", origin: "Ilium, sacrum, coccyx", insertion: "Gluteal tuberosity, IT band", innervation: "Inferior gluteal nerve (L5-S2)", action: "Hip extension, external rotation" },
      { name: "Gluteus Medius", scientificName: "Gluteus medius", role: "secondary", layer: "deep", origin: "External surface of ilium", insertion: "Greater trochanter of femur", innervation: "Superior gluteal nerve (L4-S1)", action: "Hip abduction, pelvic stabilization" },
      { name: "Quadriceps", scientificName: "Quadriceps femoris", role: "primary", layer: "superficial", origin: "AIIS & upper femur", insertion: "Tibial tuberosity", innervation: "Femoral nerve (L2-L4)", action: "Knee extension" },
      { name: "Hamstrings", scientificName: "Biceps femoris group", role: "primary", layer: "superficial", origin: "Ischial tuberosity", insertion: "Fibular head & medial tibia", innervation: "Sciatic nerve (L5-S2)", action: "Knee flexion, hip extension" },
      { name: "Gastrocnemius", scientificName: "Gastrocnemius", role: "primary", layer: "superficial", origin: "Femoral condyles", insertion: "Calcaneus", innervation: "Tibial nerve (S1-S2)", action: "Plantarflexion" },
      { name: "Rectus Abdominis", scientificName: "Rectus abdominis", role: "stabilizer", layer: "superficial", origin: "Pubic symphysis", insertion: "Xiphoid process, costal cartilages 5-7", innervation: "Thoracoabdominal nerves (T7-T12)", action: "Trunk flexion, core stability" },
    ],
    equipment: [], difficulty: "intermediate", movementPattern: "gait-cycle", plane: "sagittal", forceType: "dynamic", joints: ["hip", "knee", "ankle"],
  },
  {
    id: "run-tempo", name: "Tempo Run", category: "running", subcategory: "threshold",
    description: "Sustained effort at lactate threshold pace",
    muscleGroups: ["quads", "hamstrings", "calves", "glutes"],
    muscles: [
      { name: "Quadriceps", scientificName: "Quadriceps femoris", role: "primary", layer: "superficial", origin: "AIIS & upper femur", insertion: "Tibial tuberosity", innervation: "Femoral nerve (L2-L4)", action: "Knee extension" },
      { name: "Hamstrings", scientificName: "Biceps femoris group", role: "primary", layer: "superficial", origin: "Ischial tuberosity", insertion: "Fibular head & medial tibia", innervation: "Sciatic nerve (L5-S2)", action: "Knee flexion, hip extension" },
      { name: "Gastrocnemius", scientificName: "Gastrocnemius", role: "primary", layer: "superficial", origin: "Femoral condyles", insertion: "Calcaneus", innervation: "Tibial nerve (S1-S2)", action: "Plantarflexion" },
      { name: "Gluteus Maximus", scientificName: "Gluteus maximus", role: "primary", layer: "superficial", origin: "Ilium, sacrum", insertion: "Gluteal tuberosity, IT band", innervation: "Inferior gluteal nerve (L5-S2)", action: "Hip extension" },
    ],
    equipment: [], difficulty: "intermediate", movementPattern: "gait-cycle", plane: "sagittal", forceType: "dynamic", joints: ["hip", "knee", "ankle"],
  },
  {
    id: "run-threshold", name: "Threshold Run", category: "running", subcategory: "threshold",
    description: "Running at or slightly below lactate threshold",
    muscleGroups: ["quads", "hamstrings", "calves", "glutes"],
    muscles: [
      { name: "Quadriceps", scientificName: "Quadriceps femoris", role: "primary", layer: "superficial", origin: "AIIS & upper femur", insertion: "Tibial tuberosity", innervation: "Femoral nerve (L2-L4)", action: "Knee extension" },
      { name: "Hamstrings", scientificName: "Biceps femoris group", role: "primary", layer: "superficial", origin: "Ischial tuberosity", insertion: "Fibular head", innervation: "Sciatic nerve (L5-S2)", action: "Knee flexion" },
      { name: "Gastrocnemius", scientificName: "Gastrocnemius", role: "primary", layer: "superficial", origin: "Femoral condyles", insertion: "Calcaneus", innervation: "Tibial nerve (S1-S2)", action: "Plantarflexion" },
      { name: "Gluteus Maximus", scientificName: "Gluteus maximus", role: "primary", layer: "superficial", origin: "Ilium, sacrum", insertion: "Gluteal tuberosity", innervation: "Inferior gluteal nerve", action: "Hip extension" },
    ],
    equipment: [], difficulty: "intermediate", movementPattern: "gait-cycle", plane: "sagittal", forceType: "dynamic", joints: ["hip", "knee", "ankle"],
  },
  {
    id: "run-progression", name: "Progression Run", category: "running", subcategory: "endurance",
    description: "Start easy and progressively increase pace each segment",
    muscleGroups: ["quads", "hamstrings", "calves", "glutes"],
    muscles: [
      { name: "Quadriceps", scientificName: "Quadriceps femoris", role: "primary", layer: "superficial", action: "Knee extension" },
      { name: "Hamstrings", scientificName: "Biceps femoris group", role: "primary", layer: "superficial", action: "Knee flexion, hip extension" },
      { name: "Gastrocnemius", scientificName: "Gastrocnemius", role: "primary", layer: "superficial", action: "Plantarflexion" },
      { name: "Gluteus Maximus", scientificName: "Gluteus maximus", role: "primary", layer: "superficial", action: "Hip extension" },
    ],
    equipment: [], difficulty: "intermediate", movementPattern: "gait-cycle", plane: "sagittal", forceType: "dynamic", joints: ["hip", "knee", "ankle"],
  },
  {
    id: "run-fartlek", name: "Fartlek", category: "running", subcategory: "intervals",
    description: "Unstructured speed play mixing fast and slow segments",
    muscleGroups: ["quads", "hamstrings", "calves", "glutes"],
    muscles: [
      { name: "Quadriceps", scientificName: "Quadriceps femoris", role: "primary", layer: "superficial", action: "Knee extension" },
      { name: "Hamstrings", scientificName: "Biceps femoris group", role: "primary", layer: "superficial", action: "Knee flexion, hip extension" },
      { name: "Gastrocnemius", scientificName: "Gastrocnemius", role: "primary", layer: "superficial", action: "Plantarflexion" },
      { name: "Gluteus Maximus", scientificName: "Gluteus maximus", role: "primary", layer: "superficial", action: "Hip extension" },
    ],
    equipment: [], difficulty: "intermediate", movementPattern: "gait-cycle", plane: "sagittal", forceType: "dynamic", joints: ["hip", "knee", "ankle"],
  },
  {
    id: "run-negative-split", name: "Negative Split Run", category: "running", subcategory: "endurance",
    description: "Run second half faster than the first half",
    muscleGroups: ["quads", "hamstrings", "calves", "glutes"],
    muscles: [
      { name: "Quadriceps", scientificName: "Quadriceps femoris", role: "primary", layer: "superficial", action: "Knee extension" },
      { name: "Hamstrings", scientificName: "Biceps femoris group", role: "primary", layer: "superficial", action: "Knee flexion, hip extension" },
      { name: "Gastrocnemius", scientificName: "Gastrocnemius", role: "primary", layer: "superficial", action: "Plantarflexion" },
      { name: "Gluteus Maximus", scientificName: "Gluteus maximus", role: "primary", layer: "superficial", action: "Hip extension" },
    ],
    equipment: [], difficulty: "intermediate", movementPattern: "gait-cycle", plane: "sagittal", forceType: "dynamic", joints: ["hip", "knee", "ankle"],
  },
  {
    id: "run-100m-sprint", name: "100m Sprint", category: "running", subcategory: "sprints",
    description: "Maximum effort short sprint",
    detailedDescription: "The 100m sprint demands explosive recruitment of fast-twitch (Type II) muscle fibers across the entire posterior chain. Peak power output requires maximal firing rates in the gluteus maximus and hamstrings during the drive phase.",
    muscleGroups: ["quads", "hamstrings", "calves", "glutes", "hip flexors"],
    muscles: [
      { name: "Gluteus Maximus", scientificName: "Gluteus maximus", role: "primary", layer: "superficial", origin: "Ilium, sacrum, coccyx", insertion: "Gluteal tuberosity, IT band", innervation: "Inferior gluteal nerve (L5-S2)", action: "Hip extension, propulsive force generation" },
      { name: "Hamstrings", scientificName: "Biceps femoris, Semimembranosus, Semitendinosus", role: "primary", layer: "superficial", origin: "Ischial tuberosity", insertion: "Fibular head & medial tibia", innervation: "Sciatic nerve (L5-S2)", action: "Knee flexion, hip extension, deceleration of leg swing" },
      { name: "Rectus Femoris", scientificName: "Rectus femoris", role: "primary", layer: "superficial", origin: "Anterior inferior iliac spine", insertion: "Tibial tuberosity via patellar tendon", innervation: "Femoral nerve (L2-L4)", action: "Knee extension, hip flexion during recovery phase" },
      { name: "Gastrocnemius", scientificName: "Gastrocnemius", role: "primary", layer: "superficial", origin: "Femoral condyles", insertion: "Calcaneus", innervation: "Tibial nerve (S1-S2)", action: "Explosive plantarflexion at toe-off" },
      { name: "Iliopsoas", scientificName: "Iliacus & Psoas major", role: "primary", layer: "deep", origin: "T12-L5 & iliac fossa", insertion: "Lesser trochanter", innervation: "Femoral nerve & lumbar plexus", action: "Rapid hip flexion during recovery phase" },
      { name: "Tibialis Anterior", scientificName: "Tibialis anterior", role: "secondary", layer: "superficial", origin: "Lateral tibial condyle", insertion: "Medial cuneiform, 1st metatarsal", innervation: "Deep peroneal nerve (L4-L5)", action: "Dorsiflexion during swing phase" },
    ],
    equipment: [], difficulty: "advanced", movementPattern: "sprint", plane: "sagittal", forceType: "ballistic", joints: ["hip", "knee", "ankle"],
  },
  {
    id: "run-200m-sprint", name: "200m Sprint", category: "running", subcategory: "sprints",
    description: "High-intensity sprint around the curve",
    muscleGroups: ["quads", "hamstrings", "calves", "glutes"],
    muscles: [
      { name: "Gluteus Maximus", scientificName: "Gluteus maximus", role: "primary", layer: "superficial", action: "Hip extension" },
      { name: "Hamstrings", scientificName: "Biceps femoris group", role: "primary", layer: "superficial", action: "Knee flexion, hip extension" },
      { name: "Quadriceps", scientificName: "Quadriceps femoris", role: "primary", layer: "superficial", action: "Knee extension" },
      { name: "Gastrocnemius", scientificName: "Gastrocnemius", role: "primary", layer: "superficial", action: "Plantarflexion" },
    ],
    equipment: [], difficulty: "advanced", movementPattern: "sprint", plane: "sagittal", forceType: "ballistic", joints: ["hip", "knee", "ankle"],
  },
  {
    id: "run-400m-sprint", name: "400m Sprint", category: "running", subcategory: "sprints",
    description: "Full lap sprint demanding anaerobic capacity",
    muscleGroups: ["quads", "hamstrings", "calves", "glutes"],
    muscles: [
      { name: "Gluteus Maximus", scientificName: "Gluteus maximus", role: "primary", layer: "superficial", action: "Hip extension" },
      { name: "Quadriceps", scientificName: "Quadriceps femoris", role: "primary", layer: "superficial", action: "Knee extension" },
      { name: "Hamstrings", scientificName: "Biceps femoris group", role: "primary", layer: "superficial", action: "Knee flexion" },
      { name: "Gastrocnemius", scientificName: "Gastrocnemius", role: "primary", layer: "superficial", action: "Plantarflexion" },
    ],
    equipment: [], difficulty: "advanced", movementPattern: "sprint", plane: "sagittal", forceType: "ballistic", joints: ["hip", "knee", "ankle"],
  },
  {
    id: "run-800m-repeats", name: "800m Repeats", category: "running", subcategory: "intervals",
    description: "Half-mile repeats at VO2max pace",
    muscleGroups: ["quads", "hamstrings", "calves", "glutes"],
    muscles: [
      { name: "Quadriceps", scientificName: "Quadriceps femoris", role: "primary", layer: "superficial", action: "Knee extension" },
      { name: "Hamstrings", scientificName: "Biceps femoris group", role: "primary", layer: "superficial", action: "Knee flexion" },
      { name: "Gastrocnemius", scientificName: "Gastrocnemius", role: "primary", layer: "superficial", action: "Plantarflexion" },
      { name: "Gluteus Maximus", scientificName: "Gluteus maximus", role: "primary", layer: "superficial", action: "Hip extension" },
    ],
    equipment: [], difficulty: "advanced", movementPattern: "gait-cycle", plane: "sagittal", forceType: "dynamic", joints: ["hip", "knee", "ankle"],
  },
  {
    id: "run-mile-repeats", name: "Mile Repeats", category: "running", subcategory: "intervals",
    description: "One-mile repeats at threshold to VO2max pace",
    muscleGroups: ["quads", "hamstrings", "calves", "glutes"],
    muscles: [
      { name: "Quadriceps", scientificName: "Quadriceps femoris", role: "primary", layer: "superficial", action: "Knee extension" },
      { name: "Hamstrings", scientificName: "Biceps femoris group", role: "primary", layer: "superficial", action: "Knee flexion" },
      { name: "Gastrocnemius", scientificName: "Gastrocnemius", role: "primary", layer: "superficial", action: "Plantarflexion" },
      { name: "Gluteus Maximus", scientificName: "Gluteus maximus", role: "primary", layer: "superficial", action: "Hip extension" },
    ],
    equipment: [], difficulty: "advanced", movementPattern: "gait-cycle", plane: "sagittal", forceType: "dynamic", joints: ["hip", "knee", "ankle"],
  },
  {
    id: "run-hill-sprints", name: "Hill Sprints", category: "running", subcategory: "hill-work",
    description: "Short maximal sprints up a steep hill",
    muscleGroups: ["quads", "glutes", "calves", "hamstrings"],
    muscles: [
      { name: "Gluteus Maximus", scientificName: "Gluteus maximus", role: "primary", layer: "superficial", origin: "Ilium, sacrum", insertion: "Gluteal tuberosity, IT band", innervation: "Inferior gluteal nerve (L5-S2)", action: "Powerful hip extension against gravity" },
      { name: "Quadriceps", scientificName: "Quadriceps femoris", role: "primary", layer: "superficial", action: "Knee extension driving body uphill" },
      { name: "Gastrocnemius", scientificName: "Gastrocnemius", role: "primary", layer: "superficial", action: "Explosive plantarflexion" },
      { name: "Soleus", scientificName: "Soleus", role: "secondary", layer: "deep", action: "Sustained plantarflexion support" },
      { name: "Hamstrings", scientificName: "Biceps femoris group", role: "primary", layer: "superficial", action: "Hip extension, knee flexion in recovery" },
    ],
    equipment: [], difficulty: "advanced", movementPattern: "sprint", plane: "sagittal", forceType: "ballistic", joints: ["hip", "knee", "ankle"],
  },
  {
    id: "run-hill-repeats", name: "Hill Repeats", category: "running", subcategory: "hill-work",
    description: "Longer hill efforts building strength endurance",
    muscleGroups: ["quads", "glutes", "calves", "hamstrings"],
    muscles: [
      { name: "Gluteus Maximus", scientificName: "Gluteus maximus", role: "primary", layer: "superficial", action: "Hip extension" },
      { name: "Quadriceps", scientificName: "Quadriceps femoris", role: "primary", layer: "superficial", action: "Knee extension" },
      { name: "Gastrocnemius", scientificName: "Gastrocnemius", role: "primary", layer: "superficial", action: "Plantarflexion" },
      { name: "Hamstrings", scientificName: "Biceps femoris group", role: "secondary", layer: "superficial", action: "Hip extension support" },
    ],
    equipment: [], difficulty: "intermediate", movementPattern: "gait-cycle", plane: "sagittal", forceType: "dynamic", joints: ["hip", "knee", "ankle"],
  },
  {
    id: "run-strides", name: "Strides", category: "running", subcategory: "drills",
    description: "Smooth accelerations to near-sprint speed with deceleration",
    muscleGroups: ["quads", "hamstrings", "calves", "glutes"],
    muscles: [
      { name: "Quadriceps", scientificName: "Quadriceps femoris", role: "primary", layer: "superficial", action: "Knee extension" },
      { name: "Hamstrings", scientificName: "Biceps femoris group", role: "primary", layer: "superficial", action: "Knee flexion, hip extension" },
      { name: "Gastrocnemius", scientificName: "Gastrocnemius", role: "primary", layer: "superficial", action: "Plantarflexion" },
      { name: "Gluteus Maximus", scientificName: "Gluteus maximus", role: "primary", layer: "superficial", action: "Hip extension" },
    ],
    equipment: [], difficulty: "beginner", movementPattern: "sprint", plane: "sagittal", forceType: "dynamic", joints: ["hip", "knee", "ankle"],
  },
  {
    id: "run-a-skip", name: "A-Skip Drill", category: "running", subcategory: "drills",
    description: "Skipping with high knee drive emphasizing posture",
    muscleGroups: ["hip flexors", "calves", "core"],
    muscles: [
      { name: "Iliopsoas", scientificName: "Iliacus & Psoas major", role: "primary", layer: "deep", origin: "T12-L5 & iliac fossa", insertion: "Lesser trochanter", innervation: "Femoral nerve & lumbar plexus", action: "Hip flexion for high knee drive" },
      { name: "Gastrocnemius", scientificName: "Gastrocnemius", role: "primary", layer: "superficial", action: "Plantarflexion during skip phase" },
      { name: "Rectus Abdominis", scientificName: "Rectus abdominis", role: "stabilizer", layer: "superficial", action: "Trunk stabilization during skip" },
    ],
    equipment: [], difficulty: "beginner", movementPattern: "gait-cycle", plane: "sagittal", forceType: "dynamic", joints: ["hip", "knee", "ankle"],
  },
  {
    id: "run-high-knees", name: "High Knees", category: "running", subcategory: "drills",
    description: "Rapid knee drive drill for turnover and hip flexor activation",
    muscleGroups: ["hip flexors", "calves", "core"],
    muscles: [
      { name: "Iliopsoas", scientificName: "Iliacus & Psoas major", role: "primary", layer: "deep", action: "Rapid hip flexion" },
      { name: "Rectus Femoris", scientificName: "Rectus femoris", role: "primary", layer: "superficial", action: "Hip flexion & knee extension" },
      { name: "Gastrocnemius", scientificName: "Gastrocnemius", role: "secondary", layer: "superficial", action: "Plantarflexion" },
    ],
    equipment: [], difficulty: "beginner", movementPattern: "gait-cycle", plane: "sagittal", forceType: "dynamic", joints: ["hip", "knee", "ankle"],
  },
  {
    id: "run-marathon-pace", name: "Marathon Pace Run", category: "running", subcategory: "race-specific",
    description: "Sustained running at goal marathon pace",
    muscleGroups: ["quads", "hamstrings", "calves", "glutes", "core"],
    muscles: [
      { name: "Quadriceps", scientificName: "Quadriceps femoris", role: "primary", layer: "superficial", action: "Knee extension" },
      { name: "Hamstrings", scientificName: "Biceps femoris group", role: "primary", layer: "superficial", action: "Knee flexion, hip extension" },
      { name: "Gastrocnemius", scientificName: "Gastrocnemius", role: "primary", layer: "superficial", action: "Plantarflexion" },
      { name: "Gluteus Maximus", scientificName: "Gluteus maximus", role: "primary", layer: "superficial", action: "Hip extension" },
      { name: "Transversus Abdominis", scientificName: "Transversus abdominis", role: "stabilizer", layer: "deep", action: "Core stabilization over distance" },
    ],
    equipment: [], difficulty: "advanced", movementPattern: "gait-cycle", plane: "sagittal", forceType: "dynamic", joints: ["hip", "knee", "ankle"],
  },
  {
    id: "run-vo2max", name: "VO2max Intervals", category: "running", subcategory: "intervals",
    description: "Hard efforts at 95-100% VO2max to boost oxygen uptake",
    muscleGroups: ["quads", "hamstrings", "calves", "glutes"],
    muscles: [
      { name: "Quadriceps", scientificName: "Quadriceps femoris", role: "primary", layer: "superficial", action: "Knee extension" },
      { name: "Hamstrings", scientificName: "Biceps femoris group", role: "primary", layer: "superficial", action: "Knee flexion, hip extension" },
      { name: "Gastrocnemius", scientificName: "Gastrocnemius", role: "primary", layer: "superficial", action: "Plantarflexion" },
      { name: "Gluteus Maximus", scientificName: "Gluteus maximus", role: "primary", layer: "superficial", action: "Hip extension" },
    ],
    equipment: [], difficulty: "elite", movementPattern: "gait-cycle", plane: "sagittal", forceType: "dynamic", joints: ["hip", "knee", "ankle"],
  },
  {
    id: "run-trail", name: "Trail Run", category: "running", subcategory: "endurance",
    description: "Off-road running on varied terrain",
    muscleGroups: ["quads", "hamstrings", "calves", "glutes", "ankles", "core"],
    muscles: [
      { name: "Quadriceps", scientificName: "Quadriceps femoris", role: "primary", layer: "superficial", action: "Knee extension on uneven terrain" },
      { name: "Gluteus Medius", scientificName: "Gluteus medius", role: "primary", layer: "deep", origin: "External ilium", insertion: "Greater trochanter", innervation: "Superior gluteal nerve (L4-S1)", action: "Lateral pelvic stability on uneven ground" },
      { name: "Peroneus Longus", scientificName: "Fibularis longus", role: "secondary", layer: "superficial", origin: "Fibular head", insertion: "1st metatarsal, medial cuneiform", innervation: "Superficial peroneal nerve (L5-S1)", action: "Ankle eversion and stabilization" },
      { name: "Tibialis Anterior", scientificName: "Tibialis anterior", role: "secondary", layer: "superficial", action: "Dorsiflexion, ankle stability" },
      { name: "Transversus Abdominis", scientificName: "Transversus abdominis", role: "stabilizer", layer: "deep", action: "Core stabilization on variable terrain" },
    ],
    equipment: ["trail shoes"], difficulty: "intermediate", movementPattern: "gait-cycle", plane: "multi-planar", forceType: "dynamic", joints: ["hip", "knee", "ankle", "subtalar"],
  },
];
