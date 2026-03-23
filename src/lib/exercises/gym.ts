import { ExerciseTemplate } from "./running";

export const gymExercises: ExerciseTemplate[] = [
  // ═══ CHEST ═══
  {
    id: "gym-bench-press", name: "Barbell Bench Press", category: "gym", subcategory: "chest",
    description: "Flat barbell bench press for chest development",
    detailedDescription: "The bench press is a compound horizontal push that primarily loads the pectoralis major through shoulder horizontal adduction and elbow extension. The sternal (lower) head bears the greatest load on a flat bench, while the clavicular head increases recruitment at steeper incline angles. The triceps brachii acts as a synergist through elbow extension, and the anterior deltoid assists through shoulder flexion. Scapular retraction and depression are critical for shoulder joint stability throughout the movement.",
    muscleGroups: ["chest", "triceps", "front delts"],
    muscles: [
      { name: "Pectoralis Major (Sternal)", scientificName: "Pectoralis major – pars sternocostalis", role: "primary", layer: "superficial", origin: "Sternum, costal cartilages of ribs 1-6, external oblique aponeurosis", insertion: "Lateral lip of intertubercular (bicipital) groove of humerus", innervation: "Medial & lateral pectoral nerves (C5-T1)", action: "Horizontal adduction, shoulder flexion, internal rotation of humerus" },
      { name: "Pectoralis Major (Clavicular)", scientificName: "Pectoralis major – pars clavicularis", role: "primary", layer: "superficial", origin: "Medial half of clavicle", insertion: "Lateral lip of intertubercular groove", innervation: "Lateral pectoral nerve (C5-C7)", action: "Shoulder flexion, horizontal adduction" },
      { name: "Triceps Brachii", scientificName: "Triceps brachii", role: "secondary", layer: "superficial", origin: "Long head: infraglenoid tubercle; Lateral head: posterior humerus; Medial head: posterior humerus (below radial groove)", insertion: "Olecranon process of ulna", innervation: "Radial nerve (C6-C8)", action: "Elbow extension during lockout phase" },
      { name: "Anterior Deltoid", scientificName: "Deltoideus – pars clavicularis", role: "secondary", layer: "superficial", origin: "Lateral third of clavicle", insertion: "Deltoid tuberosity of humerus", innervation: "Axillary nerve (C5-C6)", action: "Shoulder flexion assisting the press" },
      { name: "Serratus Anterior", scientificName: "Serratus anterior", role: "stabilizer", layer: "deep", origin: "Ribs 1-8 (lateral surface)", insertion: "Anterior surface of medial border of scapula", innervation: "Long thoracic nerve (C5-C7)", action: "Scapular protraction and upward rotation, stabilizes scapula against thoracic wall" },
      { name: "Pectoralis Minor", scientificName: "Pectoralis minor", role: "stabilizer", layer: "deep", origin: "Ribs 3-5 (anterior surface)", insertion: "Coracoid process of scapula", innervation: "Medial pectoral nerve (C8-T1)", action: "Scapular depression and protraction" },
    ],
    equipment: ["barbell", "bench"], difficulty: "intermediate", movementPattern: "horizontal-press", plane: "sagittal", forceType: "push", joints: ["shoulder", "elbow"],
  },
  {
    id: "gym-incline-bench", name: "Incline Bench Press", category: "gym", subcategory: "chest",
    description: "Incline barbell press targeting upper chest",
    detailedDescription: "The incline press (30-45 degree angle) shifts emphasis to the clavicular head of the pectoralis major. EMG studies show significantly higher upper pec activation compared to flat bench. The anterior deltoid also receives greater loading due to the increased shoulder flexion angle.",
    muscleGroups: ["upper chest", "triceps", "front delts"],
    muscles: [
      { name: "Pectoralis Major (Clavicular)", scientificName: "Pectoralis major – pars clavicularis", role: "primary", layer: "superficial", origin: "Medial half of clavicle", insertion: "Lateral lip of intertubercular groove", innervation: "Lateral pectoral nerve (C5-C7)", action: "Shoulder flexion and horizontal adduction at incline angle" },
      { name: "Anterior Deltoid", scientificName: "Deltoideus – pars clavicularis", role: "primary", layer: "superficial", origin: "Lateral third of clavicle", insertion: "Deltoid tuberosity", innervation: "Axillary nerve (C5-C6)", action: "Shoulder flexion against resistance" },
      { name: "Triceps Brachii", scientificName: "Triceps brachii", role: "secondary", layer: "superficial", origin: "Infraglenoid tubercle & posterior humerus", insertion: "Olecranon process", innervation: "Radial nerve (C6-C8)", action: "Elbow extension" },
    ],
    equipment: ["barbell", "incline bench"], difficulty: "intermediate", movementPattern: "horizontal-press", plane: "sagittal", forceType: "push", joints: ["shoulder", "elbow"],
  },
  {
    id: "gym-db-fly", name: "Dumbbell Fly", category: "gym", subcategory: "chest",
    description: "Isolation chest fly with dumbbells",
    muscleGroups: ["chest"],
    muscles: [
      { name: "Pectoralis Major", scientificName: "Pectoralis major", role: "primary", layer: "superficial", origin: "Clavicle, sternum, ribs 1-6", insertion: "Intertubercular groove of humerus", innervation: "Medial & lateral pectoral nerves (C5-T1)", action: "Horizontal adduction (pure isolation)" },
      { name: "Anterior Deltoid", scientificName: "Deltoideus – pars clavicularis", role: "stabilizer", layer: "superficial", action: "Shoulder stabilization" },
    ],
    equipment: ["dumbbells", "bench"], difficulty: "beginner", movementPattern: "horizontal-adduction", plane: "frontal", forceType: "pull", joints: ["shoulder"],
  },
  {
    id: "gym-pushup", name: "Push-Up", category: "gym", subcategory: "chest",
    description: "Bodyweight chest and tricep exercise",
    muscleGroups: ["chest", "triceps", "core", "front delts"],
    muscles: [
      { name: "Pectoralis Major", scientificName: "Pectoralis major", role: "primary", layer: "superficial", origin: "Clavicle, sternum, ribs", insertion: "Intertubercular groove", innervation: "Pectoral nerves (C5-T1)", action: "Horizontal press" },
      { name: "Triceps Brachii", scientificName: "Triceps brachii", role: "secondary", layer: "superficial", origin: "Posterior humerus & scapula", insertion: "Olecranon", innervation: "Radial nerve (C6-C8)", action: "Elbow extension" },
      { name: "Rectus Abdominis", scientificName: "Rectus abdominis", role: "stabilizer", layer: "superficial", action: "Anti-extension core stability" },
      { name: "Serratus Anterior", scientificName: "Serratus anterior", role: "stabilizer", layer: "deep", action: "Scapular protraction at top" },
    ],
    equipment: [], difficulty: "beginner", movementPattern: "horizontal-press", plane: "sagittal", forceType: "push", joints: ["shoulder", "elbow"],
  },

  // ═══ BACK ═══
  {
    id: "gym-deadlift", name: "Conventional Deadlift", category: "gym", subcategory: "back",
    description: "Full-body pulling movement from the floor",
    detailedDescription: "The deadlift is the ultimate compound movement, engaging the entire posterior chain. It begins as a leg press off the floor (knee extension dominant) and transitions to a hip hinge (hip extension dominant) as the bar passes the knees. The erector spinae maintains an isometric contraction to prevent spinal flexion under load, while the latissimus dorsi keeps the bar close to the body.",
    muscleGroups: ["back", "glutes", "hamstrings", "traps", "core"],
    muscles: [
      { name: "Erector Spinae", scientificName: "Erector spinae (iliocostalis, longissimus, spinalis)", role: "primary", layer: "deep", origin: "Sacrum, iliac crest, spinous processes of lumbar/thoracic vertebrae", insertion: "Ribs, transverse & spinous processes of superior vertebrae, mastoid process", innervation: "Dorsal rami of spinal nerves", action: "Isometric spinal extension, prevents lumbar flexion under load" },
      { name: "Gluteus Maximus", scientificName: "Gluteus maximus", role: "primary", layer: "superficial", origin: "Ilium, sacrum, coccyx, sacrotuberous ligament", insertion: "Gluteal tuberosity, IT band", innervation: "Inferior gluteal nerve (L5-S2)", action: "Hip extension, drives lockout" },
      { name: "Hamstrings", scientificName: "Biceps femoris, Semimembranosus, Semitendinosus", role: "primary", layer: "superficial", origin: "Ischial tuberosity", insertion: "Fibular head & medial tibia", innervation: "Sciatic nerve (L5-S2)", action: "Hip extension and knee flexion control" },
      { name: "Quadriceps", scientificName: "Quadriceps femoris", role: "primary", layer: "superficial", origin: "AIIS & femur", insertion: "Tibial tuberosity", innervation: "Femoral nerve (L2-L4)", action: "Knee extension during initial pull off floor" },
      { name: "Latissimus Dorsi", scientificName: "Latissimus dorsi", role: "secondary", layer: "superficial", origin: "Spinous processes T7-L5, thoracolumbar fascia, iliac crest, ribs 9-12", insertion: "Intertubercular groove of humerus", innervation: "Thoracodorsal nerve (C6-C8)", action: "Keeps bar close to body, shoulder extension" },
      { name: "Trapezius", scientificName: "Trapezius", role: "secondary", layer: "superficial", origin: "External occipital protuberance, spinous processes C7-T12", insertion: "Lateral clavicle, acromion, spine of scapula", innervation: "Accessory nerve (CN XI), C3-C4", action: "Scapular retraction, supports upper back position" },
      { name: "Transversus Abdominis", scientificName: "Transversus abdominis", role: "stabilizer", layer: "deep", action: "Intra-abdominal pressure, spinal stability" },
      { name: "Multifidus", scientificName: "Multifidus", role: "stabilizer", layer: "deep", origin: "Sacrum, mammillary processes of lumbar vertebrae", insertion: "Spinous processes 2-4 segments above", innervation: "Dorsal rami of spinal nerves", action: "Segmental spinal stabilization" },
    ],
    equipment: ["barbell"], difficulty: "advanced", movementPattern: "hip-hinge", plane: "sagittal", forceType: "pull", joints: ["hip", "knee", "spine"],
  },
  {
    id: "gym-pullup", name: "Pull-Up", category: "gym", subcategory: "back",
    description: "Overhand grip vertical pull",
    detailedDescription: "The pull-up is a closed-chain vertical pull that demands significant lat activation for shoulder adduction and extension. The wide overhand grip maximizes latissimus dorsi stretch and contraction range. Brachioradialis and biceps serve as elbow flexor synergists.",
    muscleGroups: ["lats", "biceps", "rear delts", "core"],
    muscles: [
      { name: "Latissimus Dorsi", scientificName: "Latissimus dorsi", role: "primary", layer: "superficial", origin: "Spinous processes T7-L5, thoracolumbar fascia, iliac crest, ribs 9-12", insertion: "Intertubercular groove of humerus", innervation: "Thoracodorsal nerve (C6-C8)", action: "Shoulder adduction and extension (pulling body upward)" },
      { name: "Teres Major", scientificName: "Teres major", role: "primary", layer: "deep", origin: "Inferior angle of scapula", insertion: "Medial lip of intertubercular groove", innervation: "Lower subscapular nerve (C5-C7)", action: "Shoulder adduction, internal rotation, extension" },
      { name: "Biceps Brachii", scientificName: "Biceps brachii", role: "secondary", layer: "superficial", origin: "Short head: coracoid process; Long head: supraglenoid tubercle", insertion: "Radial tuberosity", innervation: "Musculocutaneous nerve (C5-C6)", action: "Elbow flexion" },
      { name: "Brachioradialis", scientificName: "Brachioradialis", role: "secondary", layer: "superficial", origin: "Lateral supracondylar ridge of humerus", insertion: "Styloid process of radius", innervation: "Radial nerve (C5-C6)", action: "Elbow flexion in neutral grip" },
      { name: "Rhomboids", scientificName: "Rhomboid major & minor", role: "secondary", layer: "deep", origin: "Spinous processes C7-T5", insertion: "Medial border of scapula", innervation: "Dorsal scapular nerve (C4-C5)", action: "Scapular retraction" },
      { name: "Lower Trapezius", scientificName: "Trapezius – pars ascendens", role: "stabilizer", layer: "superficial", action: "Scapular depression" },
    ],
    equipment: ["pull-up bar"], difficulty: "intermediate", movementPattern: "vertical-pull", plane: "frontal", forceType: "pull", joints: ["shoulder", "elbow"],
  },
  {
    id: "gym-barbell-row", name: "Barbell Bent-Over Row", category: "gym", subcategory: "back",
    description: "Barbell row for back thickness",
    muscleGroups: ["lats", "rhomboids", "traps", "biceps"],
    muscles: [
      { name: "Latissimus Dorsi", scientificName: "Latissimus dorsi", role: "primary", layer: "superficial", action: "Shoulder extension and adduction" },
      { name: "Rhomboids", scientificName: "Rhomboid major & minor", role: "primary", layer: "deep", origin: "Spinous processes C7-T5", insertion: "Medial border of scapula", innervation: "Dorsal scapular nerve (C4-C5)", action: "Scapular retraction (squeeze)" },
      { name: "Trapezius (Middle)", scientificName: "Trapezius – pars transversa", role: "primary", layer: "superficial", action: "Scapular retraction" },
      { name: "Posterior Deltoid", scientificName: "Deltoideus – pars spinalis", role: "secondary", layer: "superficial", origin: "Spine of scapula", insertion: "Deltoid tuberosity", innervation: "Axillary nerve (C5-C6)", action: "Shoulder horizontal abduction/extension" },
      { name: "Biceps Brachii", scientificName: "Biceps brachii", role: "secondary", layer: "superficial", action: "Elbow flexion" },
      { name: "Erector Spinae", scientificName: "Erector spinae", role: "stabilizer", layer: "deep", action: "Isometric spinal extension (maintains bent position)" },
    ],
    equipment: ["barbell"], difficulty: "intermediate", movementPattern: "horizontal-pull", plane: "sagittal", forceType: "pull", joints: ["shoulder", "elbow", "spine"],
  },
  {
    id: "gym-lat-pulldown", name: "Lat Pulldown", category: "gym", subcategory: "back",
    description: "Machine or cable pulldown for lat width",
    muscleGroups: ["lats", "biceps"],
    muscles: [
      { name: "Latissimus Dorsi", scientificName: "Latissimus dorsi", role: "primary", layer: "superficial", action: "Shoulder adduction and extension" },
      { name: "Teres Major", scientificName: "Teres major", role: "secondary", layer: "deep", action: "Shoulder adduction and internal rotation" },
      { name: "Biceps Brachii", scientificName: "Biceps brachii", role: "secondary", layer: "superficial", action: "Elbow flexion" },
      { name: "Lower Trapezius", scientificName: "Trapezius – pars ascendens", role: "stabilizer", layer: "superficial", action: "Scapular depression" },
    ],
    equipment: ["cable machine"], difficulty: "beginner", movementPattern: "vertical-pull", plane: "frontal", forceType: "pull", joints: ["shoulder", "elbow"],
  },

  // ═══ SHOULDERS ═══
  {
    id: "gym-ohp", name: "Overhead Press (Barbell)", category: "gym", subcategory: "shoulders",
    description: "Standing barbell press for shoulder strength",
    detailedDescription: "The overhead press is a compound vertical push demanding complete shoulder complex coordination. The deltoid (all three heads, with anterior dominant) drives humeral abduction and flexion. The supraspinatus initiates the first 15 degrees of abduction. The serratus anterior and trapezius upwardly rotate the scapula to allow full overhead range.",
    muscleGroups: ["front delts", "side delts", "triceps", "core"],
    muscles: [
      { name: "Anterior Deltoid", scientificName: "Deltoideus – pars clavicularis", role: "primary", layer: "superficial", origin: "Lateral third of clavicle", insertion: "Deltoid tuberosity", innervation: "Axillary nerve (C5-C6)", action: "Shoulder flexion, primary mover overhead" },
      { name: "Lateral Deltoid", scientificName: "Deltoideus – pars acromialis", role: "primary", layer: "superficial", origin: "Acromion", insertion: "Deltoid tuberosity", innervation: "Axillary nerve (C5-C6)", action: "Shoulder abduction" },
      { name: "Triceps Brachii", scientificName: "Triceps brachii", role: "secondary", layer: "superficial", action: "Elbow extension during lockout" },
      { name: "Supraspinatus", scientificName: "Supraspinatus", role: "secondary", layer: "deep", origin: "Supraspinous fossa of scapula", insertion: "Greater tubercle of humerus (superior facet)", innervation: "Suprascapular nerve (C5-C6)", action: "Initiates first 15° of shoulder abduction" },
      { name: "Serratus Anterior", scientificName: "Serratus anterior", role: "stabilizer", layer: "deep", action: "Scapular upward rotation for full overhead ROM" },
      { name: "Upper Trapezius", scientificName: "Trapezius – pars descendens", role: "stabilizer", layer: "superficial", action: "Scapular elevation and upward rotation" },
    ],
    equipment: ["barbell"], difficulty: "intermediate", movementPattern: "vertical-press", plane: "sagittal", forceType: "push", joints: ["shoulder", "elbow"],
  },
  {
    id: "gym-lateral-raise", name: "Lateral Raise", category: "gym", subcategory: "shoulders",
    description: "Dumbbell side raise for medial delt width",
    muscleGroups: ["side delts"],
    muscles: [
      { name: "Lateral Deltoid", scientificName: "Deltoideus – pars acromialis", role: "primary", layer: "superficial", origin: "Acromion process", insertion: "Deltoid tuberosity of humerus", innervation: "Axillary nerve (C5-C6)", action: "Shoulder abduction (raising arms to sides)" },
      { name: "Supraspinatus", scientificName: "Supraspinatus", role: "secondary", layer: "deep", origin: "Supraspinous fossa", insertion: "Greater tubercle (superior)", innervation: "Suprascapular nerve (C5-C6)", action: "Initiates abduction 0-15°" },
      { name: "Upper Trapezius", scientificName: "Trapezius – pars descendens", role: "stabilizer", layer: "superficial", action: "Scapular elevation (compensatory, minimize this)" },
    ],
    equipment: ["dumbbells"], difficulty: "beginner", movementPattern: "shoulder-abduction", plane: "frontal", forceType: "pull", joints: ["shoulder"],
  },

  // ═══ LEGS ═══
  {
    id: "gym-back-squat", name: "Back Squat", category: "gym", subcategory: "legs",
    description: "Barbell back squat — king of leg exercises",
    detailedDescription: "The back squat is a compound lower-body movement that loads the entire kinetic chain. The quadriceps drive knee extension during the ascent, while the gluteus maximus provides hip extension. Deep squats (below parallel) increase gluteal and adductor activation. The erector spinae and abdominal wall work isometrically to maintain spinal neutrality under load.",
    muscleGroups: ["quads", "glutes", "hamstrings", "core"],
    muscles: [
      { name: "Quadriceps", scientificName: "Quadriceps femoris (rectus femoris, vastus lateralis, vastus medialis, vastus intermedius)", role: "primary", layer: "superficial", origin: "AIIS (rectus femoris), greater trochanter & intertrochanteric line (vastus lateralis), intertrochanteric line (vastus medialis), anterior femur (vastus intermedius)", insertion: "Tibial tuberosity via patellar tendon", innervation: "Femoral nerve (L2-L4)", action: "Knee extension during ascending phase" },
      { name: "Gluteus Maximus", scientificName: "Gluteus maximus", role: "primary", layer: "superficial", origin: "Ilium, sacrum, coccyx", insertion: "Gluteal tuberosity, IT band", innervation: "Inferior gluteal nerve (L5-S2)", action: "Hip extension from the hole" },
      { name: "Adductor Magnus", scientificName: "Adductor magnus (posterior/hamstring portion)", role: "secondary", layer: "deep", origin: "Ischial tuberosity & inferior pubic ramus", insertion: "Adductor tubercle of femur & linea aspera", innervation: "Obturator nerve & sciatic nerve (L2-L4)", action: "Hip extension and adduction" },
      { name: "Hamstrings", scientificName: "Biceps femoris group", role: "secondary", layer: "superficial", action: "Hip extension assistance, knee stabilization" },
      { name: "Erector Spinae", scientificName: "Erector spinae", role: "stabilizer", layer: "deep", action: "Isometric spinal extension under load" },
      { name: "Rectus Abdominis", scientificName: "Rectus abdominis", role: "stabilizer", layer: "superficial", action: "Anti-extension, intra-abdominal pressure" },
      { name: "Gluteus Medius", scientificName: "Gluteus medius", role: "stabilizer", layer: "deep", action: "Prevents knee valgus, lateral hip stability" },
    ],
    equipment: ["barbell", "squat rack"], difficulty: "intermediate", movementPattern: "squat", plane: "sagittal", forceType: "compound", joints: ["hip", "knee", "ankle", "spine"],
  },
  {
    id: "gym-rdl", name: "Romanian Deadlift (RDL)", category: "gym", subcategory: "legs",
    description: "Hip hinge targeting hamstrings and glutes",
    detailedDescription: "The RDL is a hip-hinge pattern that eccentrically loads the hamstrings through hip flexion while maintaining a slight knee bend. The hamstrings work as hip extensors (not knee flexors) in this movement. It is one of the most effective exercises for hamstring hypertrophy and preventing hamstring strains.",
    muscleGroups: ["hamstrings", "glutes", "lower back"],
    muscles: [
      { name: "Hamstrings", scientificName: "Biceps femoris (long head), Semimembranosus, Semitendinosus", role: "primary", layer: "superficial", origin: "Ischial tuberosity", insertion: "Fibular head (biceps), medial tibial condyle (semimembranosus), pes anserinus (semitendinosus)", innervation: "Sciatic nerve – tibial division (L5-S2)", action: "Eccentric hip extension control (lowering), concentric hip extension (raising)" },
      { name: "Gluteus Maximus", scientificName: "Gluteus maximus", role: "primary", layer: "superficial", origin: "Ilium, sacrum", insertion: "Gluteal tuberosity, IT band", innervation: "Inferior gluteal nerve (L5-S2)", action: "Hip extension at lockout" },
      { name: "Erector Spinae", scientificName: "Erector spinae", role: "secondary", layer: "deep", action: "Isometric spinal extension" },
      { name: "Adductor Magnus", scientificName: "Adductor magnus (posterior portion)", role: "secondary", layer: "deep", action: "Hip extension assistance" },
    ],
    equipment: ["barbell"], difficulty: "intermediate", movementPattern: "hip-hinge", plane: "sagittal", forceType: "pull", joints: ["hip", "spine"],
  },
  {
    id: "gym-hip-thrust", name: "Barbell Hip Thrust", category: "gym", subcategory: "legs",
    description: "Glute-focused hip extension against a bench",
    muscleGroups: ["glutes", "hamstrings"],
    muscles: [
      { name: "Gluteus Maximus", scientificName: "Gluteus maximus", role: "primary", layer: "superficial", origin: "Ilium, sacrum, coccyx", insertion: "Gluteal tuberosity, IT band", innervation: "Inferior gluteal nerve (L5-S2)", action: "Hip extension through full ROM, peak contraction at top" },
      { name: "Hamstrings", scientificName: "Biceps femoris group", role: "secondary", layer: "superficial", action: "Hip extension assistance" },
      { name: "Quadriceps", scientificName: "Quadriceps femoris", role: "stabilizer", layer: "superficial", action: "Knee stabilization in bent position" },
    ],
    equipment: ["barbell", "bench"], difficulty: "intermediate", movementPattern: "hip-extension", plane: "sagittal", forceType: "push", joints: ["hip"],
  },
  {
    id: "gym-leg-press", name: "Leg Press", category: "gym", subcategory: "legs",
    description: "Machine press for quad and glute loading",
    muscleGroups: ["quads", "glutes", "hamstrings"],
    muscles: [
      { name: "Quadriceps", scientificName: "Quadriceps femoris", role: "primary", layer: "superficial", action: "Knee extension" },
      { name: "Gluteus Maximus", scientificName: "Gluteus maximus", role: "primary", layer: "superficial", action: "Hip extension" },
      { name: "Hamstrings", scientificName: "Biceps femoris group", role: "secondary", layer: "superficial", action: "Hip extension assistance" },
    ],
    equipment: ["leg press machine"], difficulty: "beginner", movementPattern: "squat", plane: "sagittal", forceType: "push", joints: ["hip", "knee"],
  },
  {
    id: "gym-bulgarian-split", name: "Bulgarian Split Squat", category: "gym", subcategory: "legs",
    description: "Rear-foot-elevated split squat for single-leg strength",
    muscleGroups: ["quads", "glutes"],
    muscles: [
      { name: "Quadriceps", scientificName: "Quadriceps femoris", role: "primary", layer: "superficial", action: "Knee extension" },
      { name: "Gluteus Maximus", scientificName: "Gluteus maximus", role: "primary", layer: "superficial", action: "Hip extension" },
      { name: "Gluteus Medius", scientificName: "Gluteus medius", role: "stabilizer", layer: "deep", action: "Lateral hip stability in single-leg stance" },
      { name: "Adductors", scientificName: "Adductor group", role: "stabilizer", layer: "deep", action: "Frontal plane stability" },
    ],
    equipment: ["dumbbells", "bench"], difficulty: "intermediate", movementPattern: "lunge", plane: "sagittal", forceType: "compound", joints: ["hip", "knee", "ankle"],
  },
  {
    id: "gym-calf-raise", name: "Standing Calf Raise", category: "gym", subcategory: "legs",
    description: "Standing calf raise for calf development",
    muscleGroups: ["calves"],
    muscles: [
      { name: "Gastrocnemius", scientificName: "Gastrocnemius (medial & lateral heads)", role: "primary", layer: "superficial", origin: "Medial head: medial femoral condyle; Lateral head: lateral femoral condyle", insertion: "Calcaneus via Achilles tendon", innervation: "Tibial nerve (S1-S2)", action: "Plantarflexion (standing = full gastrocnemius recruitment)" },
      { name: "Soleus", scientificName: "Soleus", role: "secondary", layer: "deep", origin: "Posterior tibia, fibular head, interosseous membrane", insertion: "Calcaneus via Achilles tendon", innervation: "Tibial nerve (S1-S2)", action: "Plantarflexion (more active with knee bent)" },
    ],
    equipment: ["calf raise machine"], difficulty: "beginner", movementPattern: "plantarflexion", plane: "sagittal", forceType: "push", joints: ["ankle"],
  },

  // ═══ ARMS ═══
  {
    id: "gym-barbell-curl", name: "Barbell Bicep Curl", category: "gym", subcategory: "arms",
    description: "Standing barbell curl for bicep mass",
    muscleGroups: ["biceps"],
    muscles: [
      { name: "Biceps Brachii", scientificName: "Biceps brachii (long head & short head)", role: "primary", layer: "superficial", origin: "Long head: supraglenoid tubercle; Short head: coracoid process", insertion: "Radial tuberosity & bicipital aponeurosis", innervation: "Musculocutaneous nerve (C5-C6)", action: "Elbow flexion, forearm supination" },
      { name: "Brachialis", scientificName: "Brachialis", role: "secondary", layer: "deep", origin: "Anterior surface of distal humerus", insertion: "Coronoid process & tuberosity of ulna", innervation: "Musculocutaneous nerve (C5-C6)", action: "Elbow flexion (primary elbow flexor regardless of forearm position)" },
      { name: "Brachioradialis", scientificName: "Brachioradialis", role: "secondary", layer: "superficial", origin: "Lateral supracondylar ridge of humerus", insertion: "Styloid process of radius", innervation: "Radial nerve (C5-C6)", action: "Elbow flexion" },
    ],
    equipment: ["barbell"], difficulty: "beginner", movementPattern: "elbow-flexion", plane: "sagittal", forceType: "pull", joints: ["elbow"],
  },
  {
    id: "gym-tricep-pushdown", name: "Tricep Cable Pushdown", category: "gym", subcategory: "arms",
    description: "Cable pushdown for tricep isolation",
    muscleGroups: ["triceps"],
    muscles: [
      { name: "Triceps Brachii (Lateral Head)", scientificName: "Triceps brachii – caput laterale", role: "primary", layer: "superficial", origin: "Posterior humerus (above radial groove)", insertion: "Olecranon process of ulna", innervation: "Radial nerve (C7-C8)", action: "Elbow extension" },
      { name: "Triceps Brachii (Medial Head)", scientificName: "Triceps brachii – caput mediale", role: "primary", layer: "deep", origin: "Posterior humerus (below radial groove)", insertion: "Olecranon process", innervation: "Radial nerve (C7-C8)", action: "Elbow extension (active at all ranges)" },
      { name: "Anconeus", scientificName: "Anconeus", role: "secondary", layer: "superficial", origin: "Lateral epicondyle of humerus", insertion: "Olecranon & posterior ulna", innervation: "Radial nerve (C7-C8)", action: "Assists elbow extension" },
    ],
    equipment: ["cable machine"], difficulty: "beginner", movementPattern: "elbow-extension", plane: "sagittal", forceType: "push", joints: ["elbow"],
  },

  // ═══ CORE ═══
  {
    id: "gym-plank", name: "Plank", category: "gym", subcategory: "core",
    description: "Isometric core hold on forearms",
    muscleGroups: ["core", "shoulders"],
    muscles: [
      { name: "Rectus Abdominis", scientificName: "Rectus abdominis", role: "primary", layer: "superficial", origin: "Pubic symphysis & pubic crest", insertion: "Xiphoid process, costal cartilages 5-7", innervation: "Thoracoabdominal nerves (T7-T12)", action: "Anti-extension (preventing lumbar hyperextension)" },
      { name: "Transversus Abdominis", scientificName: "Transversus abdominis", role: "primary", layer: "deep", origin: "Iliac crest, inguinal ligament, thoracolumbar fascia, costal cartilages 7-12", insertion: "Linea alba, pubic crest", innervation: "Thoracoabdominal nerves (T7-T12)", action: "Core compression and stabilization" },
      { name: "Internal Oblique", scientificName: "Obliquus internus abdominis", role: "secondary", layer: "deep", origin: "Thoracolumbar fascia, iliac crest, inguinal ligament", insertion: "Ribs 10-12, linea alba", innervation: "Thoracoabdominal nerves (T7-T12)", action: "Trunk stabilization" },
      { name: "External Oblique", scientificName: "Obliquus externus abdominis", role: "secondary", layer: "superficial", origin: "External surfaces of ribs 5-12", insertion: "Linea alba, iliac crest, pubic tubercle", innervation: "Thoracoabdominal nerves (T7-T12)", action: "Trunk stabilization, anti-rotation" },
    ],
    equipment: [], difficulty: "beginner", movementPattern: "anti-extension", plane: "sagittal", forceType: "isometric", joints: ["spine"],
  },
  {
    id: "gym-hanging-leg-raise", name: "Hanging Leg Raise", category: "gym", subcategory: "core",
    description: "Hanging from bar, raise legs for lower abs",
    muscleGroups: ["lower abs", "hip flexors"],
    muscles: [
      { name: "Rectus Abdominis (Lower)", scientificName: "Rectus abdominis (inferior portion)", role: "primary", layer: "superficial", action: "Posterior pelvic tilt during leg raise" },
      { name: "Iliopsoas", scientificName: "Iliacus & Psoas major", role: "primary", layer: "deep", origin: "T12-L5 & iliac fossa", insertion: "Lesser trochanter", innervation: "Femoral nerve & lumbar plexus (L1-L3)", action: "Hip flexion against gravity" },
      { name: "Rectus Femoris", scientificName: "Rectus femoris", role: "secondary", layer: "superficial", action: "Hip flexion with knee extended" },
    ],
    equipment: ["pull-up bar"], difficulty: "intermediate", movementPattern: "hip-flexion", plane: "sagittal", forceType: "dynamic", joints: ["hip", "spine"],
  },
  {
    id: "gym-kettlebell-swing", name: "Kettlebell Swing", category: "gym", subcategory: "core",
    description: "Explosive hip hinge with kettlebell for posterior chain power",
    muscleGroups: ["glutes", "hamstrings", "core", "shoulders"],
    muscles: [
      { name: "Gluteus Maximus", scientificName: "Gluteus maximus", role: "primary", layer: "superficial", action: "Explosive hip extension" },
      { name: "Hamstrings", scientificName: "Biceps femoris group", role: "primary", layer: "superficial", action: "Hip extension" },
      { name: "Erector Spinae", scientificName: "Erector spinae", role: "stabilizer", layer: "deep", action: "Spinal stability during hinge" },
      { name: "Rectus Abdominis", scientificName: "Rectus abdominis", role: "stabilizer", layer: "superficial", action: "Anti-extension, force transfer" },
    ],
    equipment: ["kettlebell"], difficulty: "intermediate", movementPattern: "hip-hinge", plane: "sagittal", forceType: "ballistic", joints: ["hip", "spine", "shoulder"],
  },
];
