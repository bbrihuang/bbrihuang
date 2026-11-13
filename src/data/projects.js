// `home` (1, 2, 3) puts a project on the home page, in that order, under its `short` name.
// A `clip` ({ src, poster }) plays there on hover in place of the cover.
export const projects = [
    {
        title: "Room Temperature Monitor",
        areas: ["hardware"],
        tag: "Hardware",
        description: "Built an Arduino temperature monitor that sounds an alarm outside 60 to 80°F and runs about 7.8 hours on a 9V battery, in a 3D-printed ABS case I designed.",
        chips: ["Arduino UNO", "C++", "TMP36", "Onshape"],
        year: "2026",
        featured: true,
        home: 3,
        short: "Temp monitor",
        slug: "room-temperature-monitor",
        cover: "/projects/room-temperature-monitor/hero.webp",
        coverAlt: "The finished Room Temperature Monitor in its black 3D-printed case.",
    },
    {
        title: "Project JetHexa",
        areas: [
            "software",
            "hardware"
        ],
        tag: "Robotics · Software",
        description: "A ROS 2 and Gazebo simulation of an 18-DOF hexapod robot for training a walking gait.",
        chips: [
            "ROS 2",
            "Gazebo",
            "Python",
            "Docker",
            "WSL",
            "URDF / SDF"
        ],
        year: "2026",
        slug: "jethexa",
        cover: "/projects/jethexa/cover.webp",
        coverAlt: "The JetHexa hexapod robot.",
        github: "https://github.com/buaiml/Robotics-Group-Proj",
        summary: "A full simulation of the JetHexa hexapod so an 8-person team can train a reinforcement-learning walking gait before it ever touches hardware. The sim carries the real robot’s sensors and joint limits, so what works there should transfer.",
        highlights: [
            "Built a ROS 2 and Gazebo simulation of an 18-DOF hexapod robot with lidar, RGB-D camera, and IMU.",
            "Validated the sim against hardware specs: servo limits, forward kinematics, and URDF-to-SDF sensors.",
            "Documented reproducible Docker, WSL, and VM setups for an 8-person team training a PPO walking gait."
        ],
        caseStudy: [
            {
                title: "The problem",
                text: "The JetHexa is a six-legged robot with 18 servos and a Jetson Nano onboard. Teaching it to walk by trial and error on the real robot is slow and hard on the hardware, so the team needed a simulation faithful enough to develop and check a gait first. Training itself happens in MuJoCo on the same robot model; Gazebo is where a policy gets checked against the full ROS 2 stack and sensors."
            },
            {
                title: "How it works",
                flow: [
                    {
                        label: "Robot model",
                        note: "URDF: 18 joints + sensors"
                    },
                    {
                        label: "Gazebo Harmonic",
                        note: "Physics and sensors"
                    },
                    {
                        label: "ROS 2 Humble",
                        note: "Topics via gz_ros2_control"
                    },
                    {
                        label: "Controller or policy",
                        note: "Stance, gait, PPO"
                    }
                ],
                text: "All 18 joints are position-commanded on a single topic, and joint states, a 360° lidar, an RGB-D camera and an IMU publish back through the ROS–Gazebo bridge. One launch file brings up the robot in a flat-ground world, with or without a GUI for batch runs, and a model-check script runs after every change to the robot description."
            },
            {
                title: "Challenges",
                points: [
                    {
                        title: "Matching the robot, not the newest release",
                        text: "The robot’s Jetson Nano runs Ubuntu 18.04, so ROS 2 Humble is what can actually run on it. Gazebo Classic and Humble’s default Gazebo pairing have both reached end-of-life, which left Gazebo Harmonic. There’s no prebuilt gz_ros2_control for that combination, so it’s built from source as part of the environment."
                    },
                    {
                        title: "Failures that make no noise",
                        text: "Converting the robot description from URDF to SDF renames collisions, so a sensor pointing at the wrong one loads fine and silently publishes nothing, and per-link friction quietly does nothing at all. A model check now asserts that all 18 joints and every sensor survive the conversion, and friction is set on the ground surface instead."
                    },
                    {
                        title: "Checking the sim against the math",
                        text: "The body settled at 52.5 mm off the ground when the model said 120 mm. Forward kinematics on the commanded joint angles predicted exactly 52.5 mm, so the sim was right and the hand-picked stance angles were the thing to change."
                    },
                    {
                        title: "One setup for eight people",
                        text: "Everyone on the team needs the same ROS, Gazebo and MuJoCo setup on their own machine. One provisioning script builds it in WSL, Docker, a VM or on bare metal, working out where it’s running and adjusting, with setup docs for each path."
                    }
                ]
            },
            {
                title: "Where it stands",
                text: "Both controllers come up active, all 18 joints track their commanded positions, and the lidar and IMU publish through the bridge. Next: fold the real robot’s link geometry into the model and bring a PPO-trained walking gait over from MuJoCo.",
                gallery: [
                    {
                        src: "/projects/jethexa/ik-demo.png",
                        alt: "Gazebo window showing the simulated hexapod standing on a flat grid, next to a terminal log of the inverse-kinematics demo running six stages from stand to wave, each reporting commanded versus measured joint error.",
                        caption: "The IK demo running in Gazebo: six stages from stand to wave, with commanded joints tracked to within a few degrees"
                    }
                ]
            }
        ]
    },
    {
        title: "Local LLM Research",
        areas: [
            "software"
        ],
        tag: "Software · AI/ML",
        description: "Ran twelve local LLM experiments on an RTX 5070, including a 2-bit model whose damage an importance matrix cut about 4x.",
        chips: [
            "llama.cpp",
            "Python",
            "PyTorch",
            "Transformers",
            "vLLM",
            "Ollama",
            "Google Colab"
        ],
        year: "2026",
        slug: "local-llm-research",
        cover: "/projects/local-llm-lab/cover.webp",
        coverAlt: "Chart of KL divergence against file size for plain and importance-matrix quantization.",
        github: "https://github.com/bbrihuang/local-llm-lab",
        links: [
            {
                label: "Quantization write-up",
                href: "https://github.com/bbrihuang/local-llm-lab/tree/main/03-quantization"
            },
            {
                label: "Inference engines write-up",
                href: "https://github.com/bbrihuang/local-llm-lab/tree/main/07-inference-engines"
            },
            {
                label: "Benchmarks write-up",
                href: "https://github.com/bbrihuang/local-llm-lab/tree/main/08-benchmarks"
            },
            {
                label: "Diffusion demo write-up",
                href: "https://github.com/bbrihuang/local-llm-lab/tree/main/11-diffusion-demo"
            },
            {
                label: "Models on Hugging Face",
                href: "https://huggingface.co/bbrihuang"
            }
        ],
        summary: "As a researcher in BU AI Society’s Local LLM Division, I ran twelve hands-on experiments on running language models on my own PC (an RTX 5070 with 12 GB) and a few rented Colab GPUs: speed, compression, attention, inference engines, agents, benchmarks and diffusion. Each one asks a question, measures it, and says what the numbers do and do not show.",
        highlights: [
            "Measured prefill and decode speed on an RTX 5070, then shrank Qwen3.5-4B from 16 bits to 2 bits and showed an importance matrix cuts the 2-bit damage about 4x.",
            "Found that speculative decoding never helped on a fast GPU, and that llama.cpp beat vLLM on a Colab T4 from 8 users up.",
            "Ran ARC-Challenge, MMLU-Pro and HumanEval locally with error bars, and tracked replies cut off before an answer.",
            "Compared a diffusion language model with a regular one on the same GPU: 3.7x to 8.6x faster, with a caveat about my baseline."
        ],
        caseStudy: [
            {
                title: "The question",
                text: "Local models are easy to run and hard to judge. How fast are they, what does shrinking them cost, which tricks actually help on my hardware, and how much should a benchmark score be trusted? I worked through twelve tasks for BU AI Society’s Local LLM Division, each with a measurement and a write-up."
            },
            {
                title: "Reading a prompt is far faster than writing an answer",
                text: "On Qwen3-1.7B, prefill ran at about 17,300 tokens per second and decode at about 220, because decode reads every weight from GPU memory for each new token. The cache costs 112 KiB per token."
            },
            {
                title: "Compression is free until it is not",
                text: "8 bits cost nothing measurable and 4 bits a little; plain 2 bits broke Qwen3.5-4B (its top guess matched the full model only 57% of the time); an importance matrix cut that damage about 4x at the same file size, and tool calling went from 47% right at plain 2 bits to 80% with the matrix and 95% at 4 bits.",
                gallery: [
                    {
                        src: "/projects/llm-research/size_vs_kld.png",
                        alt: "Line chart of how far each compression level drifts from the full 16-bit model, on a log scale, against file size. Plain quantization goes from 0.003 at Q8_0 (4.3 GiB) to 0.043 at Q4_K_M and 1.052 at Q2_K (1.8 GiB); with an importance matrix, Q4_K_M is 0.026 and Q2_K is 0.251.",
                        caption: "File size against how far each compression level drifts from the full model"
                    },
                    {
                        src: "/projects/llm-research/size_vs_speed.png",
                        alt: "Line chart of generation speed in tokens per second against file size, on an RTX 5070. Speed rises as the file shrinks: 65 for F16 (8 GiB), 109 for Q8_0, 151 for Q4_K_M and 181 for Q2_K (1.8 GiB).",
                        caption: "File size against generation speed on the RTX 5070"
                    },
                    {
                        src: "/projects/llm-research/tools_scores.png",
                        alt: "Bar chart of correct tries (%) in tool calling for Qwen3.5-4B, comparing q2_k, q2_k_imat and q4_k_m. Overall: 47%, 80% and 95%. One call: 31%, 83% and 89%. Several calls: 0%, 67% and 100%. No tool needed: 96%, 84% and 100%.",
                        caption: "Tool calling accuracy at plain 2 bits, 2 bits with the matrix, and 4 bits"
                    }
                ]
            },
            {
                title: "Where attention goes",
                text: "In Qwen3-0.6B, the first token gets almost no attention in layers 0 to 2, then about 55% at layer 3 and 65% to 75% in the last layers. Heads differ a lot: some cover 90% of their attention with about one past token, and a few need more than 1,000.",
                gallery: [
                    {
                        src: "/projects/llm-research/sink_and_local.png",
                        alt: "Line chart across the 28 layers of Qwen3-0.6B of the share of attention going to the last 128 tokens and to the first token alone. The first token gets almost none in layers 0 to 2, jumps to about 55% at layer 3 and is near 65% to 75% in the last layers, while the last-128 share falls to about 13% to 21%.",
                        caption: "Most attention goes to the first token and the most recent ones"
                    },
                    {
                        src: "/projects/llm-research/k90_heatmap.png",
                        alt: "Heatmap for Qwen3-0.6B with 28 layers down the side and 16 query heads across the top. Each cell is the median number of past tokens needed to cover 90% of that head’s attention, on a log scale from 1 to over 1,000. Some heads need about one token and a few need more than 1,000.",
                        caption: "How many past tokens each attention head needs to cover 90% of its attention"
                    }
                ]
            },
            {
                title: "Popular speed-ups do not always help",
                text: "Speculative decoding never beat 0.96x on this GPU, and on a Colab T4 llama.cpp matched vLLM for 1 to 4 users and led from 8 users up.",
                gallery: [
                    {
                        src: "/projects/llm-research/total_throughput.png",
                        alt: "Line chart of total tokens per second against the number of users sending requests at once, from 1 to 32. llama.cpp on an RTX 5070 reaches 543 at 16 users. On a Colab T4, llama.cpp and vLLM are close until about 4 users, then llama.cpp leads, reaching 281 against 236 at 32 users.",
                        caption: "llama.cpp against vLLM on a Colab T4, total speed by number of users"
                    }
                ]
            },
            {
                title: "What agent frameworks cost",
                text: "On Qwen3-8B, LangGraph, the OpenAI Agents SDK and PydanticAI sent 1,385 to 1,570 prompt tokens per question against 1,032 with no framework, all in about a second. smolagents sent 22,128 and took 52.9 seconds.",
                gallery: [
                    {
                        src: "/projects/llm-research/cost_per_question.png",
                        alt: "Two bar charts comparing agent frameworks on Qwen3-8B, both on a log scale. Prompt tokens sent per question: no framework 1,032, LangGraph 1,385, OpenAI Agents SDK 1,570, PydanticAI 1,422 and smolagents 22,128. Median seconds per question: 1.0, 1.0, 1.1, 0.9 and 52.9 for smolagents.",
                        caption: "What each agent framework costs per question, in tokens sent and seconds taken"
                    }
                ]
            },
            {
                title: "Scores depend on the setup",
                text: "Qwen3.5-4B scored 95% to 96% on ARC-Challenge, 70% to 74% on MMLU-Pro against the 79.1% Qwen reports (part of the gap was replies cut off before an answer, counted as wrong), and 83.5% on HumanEval.",
                gallery: [
                    {
                        src: "/projects/llm-research/harness_scores.png",
                        alt: "Dot chart with error bars of Qwen3.5-4B scores: about 95% and 96% on ARC-Challenge, and 70.0%, 72.4% and 73.8% on MMLU-Pro. A dashed line marks Qwen’s official MMLU-Pro score of 79.1%. Hollow diamonds show scores counting only the questions it finished, which sit closer to that line.",
                        caption: "Qwen3.5-4B on ARC-Challenge and MMLU-Pro, with error bars"
                    },
                    {
                        src: "/projects/llm-research/benchmark_timeline.png",
                        alt: "Timeline from 2018 to 2026 of how long each benchmark took to be maxed out, from its release (circle) to when top models came close to the ceiling (diamond). ARC-Challenge took 5.0 years, HellaSwag 3.8, WinoGrande 2.6, MMLU 3.2, GPQA-Diamond 2.0, IFEval 1.1 and MMLU-Pro 1.4. RULER had high scores from the start. SimpleQA (best so far 74.0%) and Humanity’s Last Exam (60.9%) are not maxed out yet.",
                        caption: "How long each benchmark took to be maxed out by top models"
                    }
                ]
            },
            {
                title: "Diffusion language models are fast but behind",
                text: "DiffusionGemma wrote 3.7x to 8.6x faster than regular Gemma 4 on the same GPU; my baseline was probably slow, so those ratios are generous, and Google’s own results table shows it trailing on hard reasoning.",
                gallery: [
                    {
                        src: "/projects/llm-research/bench_speed.png",
                        alt: "Bar chart of tokens per second on six prompts (coffee-page, todo-app, pomodoro, explain, python-fn, summary). DiffusionGemma writes about 145 to 340 tokens per second, while regular Gemma 4 26B-A4B stays near 40 on every prompt.",
                        caption: "DiffusionGemma against regular Gemma 4 on the same GPU"
                    },
                    {
                        src: "/projects/llm-research/demo_todo.png",
                        alt: "Screenshot of the diffusion demo page. A status line reads “Done: 1141 tokens in 4.36 s = 261.5 tokens/s (5 canvases)”. On the left is a panel of the generated page code, showing styles for the text box and the add button. On the right is the finished to-do app, titled “My Tasks”, with an add box and four items, each with a checkbox and a Delete button.",
                        caption: "The demo page, with the code on the left and the finished to-do app on the right"
                    },
                    {
                        src: "/projects/llm-research/flow_steps.png",
                        alt: "Four scatter plots titled “Same model, fewer Euler steps”, for 1, 2, 8 and 100 steps. Grey dots are real data in two interlocking crescents. The blue dots are the model’s output: a small clump at 1 step, a loose blob at 2 steps, and close to the two crescents at 8 and 100 steps.",
                        caption: "The same tiny model run with 1, 2, 8 and 100 steps"
                    },
                    {
                        src: "/projects/llm-research/flow_animation.mp4",
                        loop: true,
                        alt: "Animation titled “Following the learned field”, with a time counter. A round cloud of about two thousand blue dots, over a grid of grey arrows showing the learned field, is moved step by step into a shape.",
                        caption: "A tiny model turning noise into a shape, step by step"
                    }
                ]
            },
            {
                title: "Who did what",
                text: "I ran every command and measurement myself. Claude helped write and explain the scripts, drafted the reports and slide decks, and summarized the reading material; the READMEs say where that applies. Where a result is unexplained or unverified, the write-up says so."
            }
        ]
    },
    {
        title: "TerrierTrays",
        areas: [
            "software"
        ],
        tag: "Software · Hackathon",
        description: "Placed 2nd in the Information Access track at Hackcessability 2026 with a web app that plans BU dining-hall meals to a calorie and macro target.",
        chips: [
            "TypeScript",
            "React",
            "Tailwind CSS",
            "Vite",
            "Zod",
            "Vitest",
            "Python",
            "scikit-learn",
            "GitHub Actions",
            "Vercel"
        ],
        year: "2026",
        home: 2,
        short: "TerrierTrays",
        slug: "terriertrays",
        cover: "/projects/terriertrays/plan.webp",
        coverAlt: "The TerrierTrays Plan tab showing Your daily totals as four rings for calories, protein, carbs and fat, above a dinner plate of 705 kcal.",
        github: "https://github.com/bbrihuang/terriertrays",
        links: [
            {
                label: "Live site",
                href: "https://terriertrays.vercel.app"
            },
            {
                label: "Devpost write-up",
                href: "https://devpost.com/software/in-progress-ywnsm5"
            }
        ],
        summary: "A web app that turns Boston University’s dining menus into a meal plan. It reads the real menus for three halls, suggests plates against a daily calorie target, and keeps track of calories, protein, carbs and fat. A team of four built it at Hackcessability 2026 and took 2nd place in the Information Access track.",
        highlights: [
            "Came up with TerrierTrays and led its web app, so students can plan a day of BU dining-hall meals in one place instead of clicking between menus, items and days.",
            "Placed 2nd in the Information Access track at Hackcessability 2026 with a team of four, by making open dining data easy to find, understand and act on.",
            "Built the app to label menus older than 24 hours and pause suggestions, and to treat dishes with no allergen list as unknown, so it never plans from stale food or reads an empty list as safe.",
            "Wired the team’s calorie model into a review step, so students see the estimate and tap Apply before any target changes."
        ],
        caseStudy: [
            {
                title: "The problem",
                text: "BU Dining publishes menus, nutrition and allergens, but on a slow site. Planning meals to a calorie or macro target means clicking between menus, items and days. Hackcessability is run by Kappa Theta Pi Lambda Chapter, the BU Cybersecurity Association and CDS Student Government. The Information Access track asks teams to use open data to make hidden or complex information easier to find, understand or act on. The team also did the cybersecurity subtrack."
            },
            {
                title: "How it works",
                flow: [
                    {
                        label: "Scraper",
                        note: "Python, daily at 5:30 am New York time"
                    },
                    {
                        label: "Freshness check",
                        note: "Validates the data in GitHub Actions"
                    },
                    {
                        label: "menu-data branch",
                        note: "JSON per hall, per day"
                    },
                    {
                        label: "Site build",
                        note: "Pulls the data in on Vercel"
                    },
                    {
                        label: "React app",
                        note: "Plans in the browser"
                    }
                ],
                text: "The app reads real menus for West Campus, Warren Towers and Marciano Commons up to a week ahead, meal by meal with hours. For the current meal it suggests up to three plates in whole dining-hall servings against a daily calorie target. “Not this” swaps a dish and “Why this plan?” explains the choice. You can also build your own plate from the Menu tab. Daily totals across halls show as four rings, and the Week tab plans seven days at one hall. Filters cover allergens and vegetarian, vegan, halal and gluten-free. It runs in the browser with no account and no tracking, and the measurements behind the calorie estimate are never saved or sent.",
                gallery: [
                    {
                        src: "/projects/terriertrays/plan.webp",
                        alt: "The TerrierTrays Plan tab: Dinner at West Campus, the meal times, and Your daily totals as four rings for calories (705 of 2,400), protein, carbs and fat.",
                        caption: "The Plan tab, with daily totals across halls as four rings"
                    },
                    {
                        src: "/projects/terriertrays/menu.webp",
                        alt: "The TerrierTrays Menu tab listing West Campus dinner dishes with their calories per serving and a plus button on each.",
                        caption: "The Menu tab: the West Campus dinner list, ready to build a plate from"
                    }
                ]
            },
            {
                title: "Who did what",
                text: "I came up with the idea and led the web app. Aladin Crnolic wrote the Python scraper for BU Dining menu, nutrition and allergen data, and automated the daily updates and freshness checks with GitHub Actions. Adrian Miller built the linear regression calorie model and the data cleaning. Erik Wang helped design and build the website.",
                gallery: [
                    {
                        src: "/projects/terriertrays/team.webp",
                        alt: "The four teammates standing together in front of tall windows with a view over the Charles River and Boston.",
                        caption: "The team at Hackcessability 2026"
                    }
                ]
            },
            {
                title: "Challenges",
                points: [
                    {
                        title: "Allergens BU doesn’t list",
                        text: "BU leaves the allergen list empty for many dishes. Allergens are known for only 46% to 60% of items per hall. So an empty list never means allergen-free, and when a filter is on, dishes with unknown allergens are left out of suggestions."
                    },
                    {
                        title: "Menus that go stale",
                        text: "A plan built on old data is worse than no plan. The scraper checks freshness before it publishes. If the menus are over 24 hours old, the app labels them as old and pauses suggestions instead of planning from stale food."
                    },
                    {
                        title: "A model that only looks good on training data",
                        text: "The calorie model is a linear regression on age, gender, height, weight and activity level, and it is typically off by about 111 kcal. The team hit data leakage and overfitting along the way, and learned that a high R² on training data doesn’t make a model reliable. So validation came before training score. The model refuses inputs outside its training range, and you review the number and tap Apply before anything changes."
                    },
                    {
                        title: "Accessibility",
                        text: "The goal was WCAG 2.2 AA: 44 px touch targets, keyboard and screen-reader paths, and reduced motion."
                    }
                ]
            },
            {
                title: "Where it stands",
                text: "It is live and works for West Campus, Warren Towers and Marciano Commons. Fenway and Granby are not included yet. Next ideas are logins, hall picks that know your class schedule, and dining dollars."
            }
        ]
    },
    {
        title: "PC Homelab",
        areas: [
            "software",
            "hardware"
        ],
        tag: "Hardware · Software",
        description: "My daily drivers, and the gaming PC that doubles as a homelab: self-hosted services, local LLMs and remote access.",
        chips: [
            "Docker",
            "WSL2",
            "Tailscale",
            "Sunshine",
            "Moonlight",
            "Ollama",
            "n8n",
            "Jellyfin",
            "Uptime Kuma",
            "Homarr"
        ],
        year: "2026",
        slug: "homelab",
        cover: "/projects/homelab/cover-169.webp",
        coverAlt: "Cover image for PC Homelab.",
        summary: "Everything I use day to day, plus one Mini-ITX PC that games, builds and serves. It runs self-hosted services in Docker on WSL2, local LLMs on the RTX 5070, and streams to my laptop and phone, all reachable from anywhere over Tailscale.",
        caseStudy: [
            {
                title: "The build",
                gallery: [
                    {
                        src: "/projects/homelab/pc.webp",
                        alt: "The Mini-ITX gaming PC that doubles as a homelab."
                    }
                ],
                points: [
                    {
                        title: "CPU",
                        text: "AMD Ryzen 7 3700X · 8 cores · 3.6 GHz"
                    },
                    {
                        title: "CPU Cooler",
                        text: "Thermalright RK120 SE · Dual Tower Cooler"
                    },
                    {
                        title: "Motherboard",
                        text: "ASUS ROG Strix B450-I Gaming · Mini-ITX · AM4"
                    },
                    {
                        title: "Memory",
                        text: "G.Skill Trident Z Royal 16 GB · 2 × 8 GB · DDR4-3200 · CL16"
                    },
                    {
                        title: "Storage",
                        text: "Crucial P3 Plus 1 TB · M.2 2280 NVMe · PCIe 4.0 x4"
                    },
                    {
                        title: "Storage",
                        text: "Inland Professional 240 GB · 2.5″ SATA SSD"
                    },
                    {
                        title: "Graphics",
                        text: "Zotac Gaming GeForce RTX 5070 Twin Edge OC · 12 GB VRAM"
                    },
                    {
                        title: "Case",
                        text: "NZXT H200 · Mini-ITX tower"
                    },
                    {
                        title: "Power Supply",
                        text: "Lian Li EDGE Gold 750 W · 80+ Gold · fully modular"
                    },
                    {
                        title: "Case Fans",
                        text: "Thermalright TL-C12C-S · 120 mm · 3-pack"
                    }
                ]
            },
            {
                title: "What it does",
                points: [
                    {
                        title: "Gaming",
                        text: "1080p at 144 Hz on the RTX 5070, and streamed to my laptop and phone with Sunshine and Moonlight."
                    },
                    {
                        title: "Development",
                        text: "WSL2 runs ROS 2 and Gazebo for the JetHexa sim, alongside Docker and local LLMs in Ollama."
                    },
                    {
                        title: "Homelab",
                        text: "Docker runs n8n, Jellyfin, Uptime Kuma, Homarr and SnapOtter, reachable anywhere over Tailscale."
                    }
                ]
            },
            {
                title: "How it fits together",
                text: "I wanted one machine that could game, build and serve, instead of three that each do one thing. Every choice below follows from that.",
                flow: [
                    {
                        label: "My laptop & phone",
                        note: "Moonlight · browser"
                    },
                    {
                        label: "Windows 11 Pro",
                        note: "Games · Sunshine · Ollama · VS Code"
                    },
                    {
                        label: "WSL2",
                        note: "A real Linux kernel running inside Windows"
                    },
                    {
                        label: "Ubuntu",
                        note: "ROS 2 · Gazebo (JetHexa)"
                    },
                    {
                        label: "Docker",
                        note: "n8n · Jellyfin · Uptime Kuma · Homarr · SnapOtter"
                    },
                    {
                        label: "Hardware",
                        note: "Ryzen 7 3700X · RTX 5070 · 16 GB · 1.24 TB"
                    }
                ]
            },
            {
                title: "Why it’s built this way",
                points: [
                    {
                        title: "One machine, three jobs",
                        text: "Instead of a separate gaming PC, server and dev box, one PC does all three. Windows runs games and everyday apps directly on the hardware, and everything else sits on top. That’s one set of parts to buy, power and maintain."
                    },
                    {
                        title: "Linux without a second computer",
                        text: "WSL2 runs a real Linux kernel inside Windows, so I never dual-boot. It hosts the Ubuntu environment for the JetHexa ROS 2 and Gazebo sim, and Docker uses it as its Linux backend, so Linux containers run here just like on a Linux server."
                    },
                    {
                        title: "Isolated, so nothing breaks the rest",
                        text: "Each homelab service lives in its own container with everything it needs, so updating one can’t take down another, and any of them can be rebuilt or moved to another machine."
                    },
                    {
                        title: "The GPU earns its keep twice",
                        text: "The RTX 5070’s 12 GB of VRAM runs games and local LLMs. The same card that plays at 144 Hz runs and profiles the models for my inference research."
                    },
                    {
                        title: "A light laptop, a heavy PC",
                        text: "Rather than carry a gaming laptop, I carry a thin 2-in-1. Sunshine streams the PC and Moonlight plays it on my laptop and phone, so the heavy lifting stays at home and I get it anywhere."
                    },
                    {
                        title: "Private by default",
                        text: "Tailscale links the PC, laptop and phone in a private network, so I reach every service from anywhere without exposing any of them to the public internet."
                    },
                    {
                        title: "Small, but not compromised",
                        text: "The whole build stays compact on a desk, but it still fits a full-size RTX 5070, a dual-tower cooler and a 750 W power supply, so size didn’t cost performance."
                    }
                ]
            },
            {
                title: "Self-hosted services",
                points: [
                    {
                        title: "n8n",
                        text: "Workflow automation that connects apps and runs scheduled jobs."
                    },
                    {
                        title: "Jellyfin",
                        text: "Media server that streams my library to any device."
                    },
                    {
                        title: "Uptime Kuma",
                        text: "Watches every service and tells me when something goes down."
                    },
                    {
                        title: "Homarr",
                        text: "One dashboard with every service in one place."
                    },
                    {
                        title: "SnapOtter",
                        text: "A self-hosted file-processing toolkit, so files never leave my hardware."
                    }
                ]
            },
            {
                title: "The trade-offs",
                points: [
                    "Mini-ITX means two RAM slots and one PCIe slot, so there’s less room to expand than on a full-size board.",
                    "Games and local LLMs share one GPU, so I don’t run heavy models while gaming.",
                    "When the PC restarts, the homelab restarts with it. It’s a homelab, not a data center."
                ]
            },
            {
                title: "Why not host my own storage?",
                text: [
                    "I don’t run a NAS or keep my backups on my own drives. I pay for iCloud+ with 2 TB instead.",
                    "Since I have an iPhone, one service backs up my entire digital life, and I don’t have to worry about a drive failing. Apple’s servers are far more reliable than anything I could set up myself. iCloud Drive also works on Windows, so my files are right there on this PC too."
                ]
            }
        ]
    },
    {
        title: "BURPG HIP: Rocket Nozzle Design",
        areas: [
            "hardware"
        ],
        tag: "Hardware · Aerospace",
        description: "Designed, analyzed, printed and hot-fire tested an 80% bell nozzle for a small hybrid rocket motor.",
        chips: [
            "SOLIDWORKS",
            "SOLIDWORKS Simulation (FEA)",
            "Resin 3D printing"
        ],
        year: "2026",
        home: 1,
        short: "Rocket nozzle",
        clip: { src: "/projects/burpg-hip/hotfire-short.mp4", poster: "/projects/burpg-hip/hotfire-short-poster.webp" },
        slug: "burpg-hip",
        cover: "/projects/burpg-hip/nozzle-photo-1.webp",
        coverAlt: "The 3D-printed amber resin nozzle on its flange, sitting on a lab bench.",
        links: [
            {
                label: "Wikifactory project",
                href: "https://wikifactory.com/+burpg/hybrid-intro-project"
            }
        ],
        summary: "A converging–diverging nozzle for a small hybrid rocket motor, taken from chamber conditions to hand calculations, CAD, FEA, a 3D print and a hot-fire test. Critical Design Review presented 3/4/26.",
        highlights: [
            "Sized a de Laval nozzle from the chamber conditions: 7.22 mm throat, 18.45 mm exit, area ratio 6.52.",
            "Chose an 80% bell over a cone and a 100% bell for near-maximum thrust efficiency at much lower length and weight.",
            "Ran FEA in SOLIDWORKS Simulation: peak von Mises stress of about 1.5 MPa against a 37.5 MPa yield strength, minimum factor of safety about 25.",
            "3D printed the nozzle in ABS-type resin and hot-fire tested it."
        ],
        caseStudy: [
            {
                title: "Overview",
                text: "I designed, analyzed, printed and hot-fire tested a converging–diverging (de Laval) nozzle for a small hybrid rocket motor. This was BURPG’s intro project, done with Jacob Knight and Hikaru Uribe, and we presented the Critical Design Review on 3/4/26."
            },
            {
                title: "Design inputs",
                stats: [
                    {
                        label: "Chamber pressure",
                        value: "551.6",
                        unit: "kPa"
                    },
                    {
                        label: "Chamber temperature",
                        value: "3250",
                        unit: "K"
                    },
                    {
                        label: "Mass flow rate",
                        value: "0.013",
                        unit: "kg/s"
                    },
                    {
                        label: "Specific heat ratio, k",
                        value: "1.13"
                    },
                    {
                        label: "Molar mass",
                        value: "0.022195",
                        unit: "kg/mol"
                    },
                    {
                        label: "Optimized exit pressure",
                        value: "14.479",
                        unit: "kPa"
                    },
                    {
                        label: "Ambient pressure",
                        value: "101.35",
                        unit: "kPa"
                    }
                ]
            },
            {
                title: "Calculations",
                stats: [
                    {
                        label: "Throat diameter",
                        value: "7.22",
                        unit: "mm"
                    },
                    {
                        label: "Exit diameter",
                        value: "18.45",
                        unit: "mm"
                    },
                    {
                        label: "Area ratio",
                        value: "6.52"
                    },
                    {
                        label: "Exit velocity",
                        value: "2691",
                        unit: "m/s"
                    },
                    {
                        label: "Critical pressure ratio",
                        value: "0.578"
                    },
                    {
                        label: "Specific impulse",
                        value: "274.4",
                        unit: "s"
                    },
                    {
                        label: "Optimal thrust",
                        value: "34.98",
                        unit: "N"
                    },
                    {
                        label: "Sea-level thrust",
                        value: "11.77",
                        unit: "N"
                    },
                    {
                        label: "80% bell length",
                        value: "16.75",
                        unit: "mm"
                    }
                ]
            },
            {
                title: "Nozzle shape decision",
                text: [
                    "I compared a cone, a 100% bell and an 80% bell. A cone’s sharper angle sends the exhaust out wider, and only the velocity along the nozzle’s axis makes thrust, so it gives less axial thrust. A 100% bell is theoretically best but slightly longer and heavier.",
                    "I chose the 80% bell. Its exhaust isn’t quite as aligned with the axis as the 100% bell’s, but it gets near-maximum thrust efficiency at much lower length and weight, and that saving is worth more than the small loss in velocity."
                ],
                gallery: [
                    {
                        src: "/projects/burpg-hip/nozzle-contour.webp",
                        alt: "Two reference diagrams. Top: a rocket chamber and converging-diverging nozzle with pressures and the converging section, throat, diverging section and exit labeled. Bottom: 60% and 80% bell contours from the throat, with the 80% bell’s length marked.",
                        caption: "Reference diagrams: converging–diverging nozzle (top) and 60% and 80% bell contours (bottom)"
                    }
                ]
            },
            {
                title: "CAD",
                text: "Modeled in SOLIDWORKS: the nozzle sits on a flange with six bolt holes, shown below from several views, exploded, and as the dimensioned drawing.",
                gallery: [
                    {
                        src: "/projects/burpg-hip/cad-overall.webp",
                        alt: "Isometric CAD view of the nozzle on its round flange with six bolt holes.",
                        caption: "Overall view"
                    },
                    {
                        src: "/projects/burpg-hip/cad-front.webp",
                        alt: "Side view of the nozzle’s flared bell sitting on a flat flange.",
                        caption: "Front view"
                    },
                    {
                        src: "/projects/burpg-hip/cad-section.webp",
                        alt: "Cross-section of the nozzle showing the wall thickness and the narrowing to the throat.",
                        caption: "Section view"
                    },
                    {
                        src: "/projects/burpg-hip/cad-top.webp",
                        alt: "Top-down CAD view of the flange with six bolt holes around the central nozzle bore.",
                        caption: "Top view"
                    },
                    {
                        src: "/projects/burpg-hip/cad-exploded.webp",
                        alt: "Exploded CAD view: the nozzle on its six-hole flange, separated from a matching flange and the part behind it.",
                        caption: "Exploded view: the nozzle on a six-hole bolted flange"
                    },
                    {
                        src: "/projects/burpg-hip/drawing.webp",
                        alt: "Dimensioned engineering drawing of the nozzle with side, top and isometric views, showing throat, exit and flange diameters and the 16.75 mm bell length.",
                        caption: "Dimensioned drawing"
                    }
                ]
            },
            {
                title: "Simulation",
                text: "I ran a static FEA in SOLIDWORKS Simulation. The part is ABS resin with a tetrahedral mesh, a pressure load on the internal surface, and the flange bolt holes held fixed. Stress peaks at the throat/nozzle fillet, still far below yield.",
                stats: [
                    {
                        label: "Peak von Mises stress",
                        value: "~1.5",
                        unit: "MPa"
                    },
                    {
                        label: "Yield strength",
                        value: "37.5",
                        unit: "MPa"
                    },
                    {
                        label: "Minimum factor of safety",
                        value: "~25"
                    }
                ],
                gallery: [
                    {
                        src: "/projects/burpg-hip/fea-mesh.webp",
                        alt: "Tetrahedral mesh on the nozzle and flange, with the internal pressure load in purple and fixed bolt holes in green.",
                        caption: "Mesh and boundary conditions"
                    },
                    {
                        src: "/projects/burpg-hip/fea-mesh-top.webp",
                        alt: "Top view of the mesh with the internal pressure load in purple and the six fixed bolt holes.",
                        caption: "Mesh and boundary conditions, top view"
                    },
                    {
                        src: "/projects/burpg-hip/fea-stress.webp",
                        alt: "Von Mises stress plot, mostly blue with a green-to-red band at the throat, peaking at 1.496e6 N/m² against a 3.751e7 yield strength.",
                        caption: "Von Mises stress: peak about 1.5 MPa near the throat"
                    },
                    {
                        src: "/projects/burpg-hip/fea-stress-top.webp",
                        alt: "Top view of the von Mises stress plot, blue across the flange with a green-yellow ring around the nozzle bore.",
                        caption: "Von Mises stress, top view"
                    },
                    {
                        src: "/projects/burpg-hip/fea-fos.webp",
                        alt: "Factor of safety plot, uniformly red, meaning the lowest values on the scale across the whole part.",
                        caption: "Factor of safety: minimum about 25"
                    },
                    {
                        src: "/projects/burpg-hip/fea-fos-top.webp",
                        alt: "Top view of the factor of safety plot, uniformly red.",
                        caption: "Factor of safety, top view"
                    }
                ]
            },
            {
                title: "Build and test",
                text: [
                    "The nozzle was 3D printed in ABS-type resin and hot-fire tested. Photos of the printed part and two hot-fire clips are below."
                ],
                gallery: [
                    {
                        src: "/projects/burpg-hip/nozzle-photo-1.webp",
                        alt: "The 3D-printed amber resin nozzle on its flange, sitting on a lab bench.",
                        caption: "Printed nozzle"
                    },
                    {
                        src: "/projects/burpg-hip/nozzle-photo-2.webp",
                        alt: "A second view of the 3D-printed amber resin nozzle and flange on a lab bench.",
                        caption: "Printed nozzle"
                    },
                    {
                        src: "/projects/burpg-hip/hotfire-short.mp4",
                        poster: "/projects/burpg-hip/hotfire-short-poster.webp",
                        alt: "Close-up of a flame coming out of the nozzle on the test stand during a hot-fire test.",
                        caption: "Hot-fire test, short clip (about 4 s)"
                    },
                    {
                        src: "/projects/burpg-hip/hotfire-long.mp4",
                        poster: "/projects/burpg-hip/hotfire-long-poster.webp",
                        alt: "Wide view of the test stand with a flame coming out of the nozzle during a hot-fire test.",
                        caption: "Hot-fire test, longer clip (about 29 s)"
                    }
                ]
            }
        ]
    },
    {
        title: "How to Build a PC",
        areas: [
            "hardware"
        ],
        tag: "Hardware · Guide",
        description: "A free beginner’s guide to choosing parts, assembling, and troubleshooting a PC.",
        chips: [
            "Technical writing",
            "Hardware diagnostics",
            "Notion"
        ],
        year: "2024-Present",
        slug: "pc-building-guide",
        cover: "/projects/pc-building-guide/cover.svg",
        coverAlt: "Cover image for How to Build a PC.",
        summary: "A free public guide that walks first-time builders through choosing compatible parts, assembling them, and troubleshooting the build.",
        highlights: [
            "Wrote a beginner-friendly guide covering part selection, assembly, and troubleshooting.",
            "Published it free and public on Notion."
        ]
    },
    {
        title: "Finance Dashboard",
        areas: [
            "software"
        ],
        tag: "Software",
        description: "A personal finance dashboard with a paycheck splitter. Write-up in progress.",
        chips: [],
        slug: "finance-dashboard",
        cover: "/projects/finance-dashboard/cover.svg",
        coverAlt: "Cover image for Finance Dashboard.",
        summary: "A personal finance dashboard with a paycheck splitter. Write-up in progress."
    },
];
