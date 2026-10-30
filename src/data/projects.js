export const projects = [
    {
        title: "Room Temperature Monitor",
        areas: ["hardware"],
        tag: "Hardware",
        description: "Built an Arduino temperature monitor that sounds an alarm outside 60 to 80°F and runs about 7.8 hours on a 9V battery, in a 3D-printed ABS case I designed.",
        chips: ["Arduino UNO", "C++", "TMP36", "Onshape"],
        year: "2026",
        featured: true,
        home: true,
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
        home: true,
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
                text: "The JetHexa is a six-legged robot with 18 servos and a Jetson Nano onboard. Teaching it to walk by trial and error on the real robot is slow and hard on the hardware, so the team needed a simulation faithful enough to develop and check a gait first. Training itself happens in MuJoCo on the same robot model; Gazebo is where a policy gets checked against the full ROS 2 stack and sensors.",
                gallery: [
                    {
                        src: "/projects/jethexa/robot.png",
                        alt: "The green and black JetHexa hexapod robot with six jointed legs, a lidar on top, and an RGB-D camera on the front.",
                        caption: "The JetHexa hexapod the simulation models"
                    }
                ]
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
        areas: ["software"],
        tag: "AI",
        description: "Ran twelve local LLM experiments on an RTX 5070, including a 2-bit model whose damage an importance matrix cut about 4x.",
        chips: ["llama.cpp", "Python", "PyTorch"],
        year: "2026",
        github: "https://github.com/bbrihuang/local-llm-lab",
        cover: "/projects/local-llm-lab/cover.webp",
        coverAlt: "Chart of KL divergence against file size for plain and importance-matrix quantization.",
    },
];
