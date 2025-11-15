# 🌐 IPv4 DFA Visualizer  
### Animated Deterministic Finite Automata Simulation for IPv4 Validation

This project is an **interactive and animated DFA (Deterministic Finite Automaton)** built to validate **IPv4 addresses** like `192.168.0.1`.  
It visually demonstrates how each character is processed, how each octet is built, and why a given input is either **Accepted** or **Rejected**.

Perfect for:
- Automata Theory mini-projects  
- College demonstrations  
- Understanding DFA transitions  
- Visual learning & presentations  

---

## ✨ Features

### 🎥 **1. Full DFA Animation**
- Active state pulses  
- Transitions animate with a glowing dot  
- Accept state highlighted in green  
- Dead state highlighted in red  

### 🧠 **2. Correct IPv4 Validation**
The DFA checks:
- Valid digit sequences  
- Octet values (`0–255`)  
- No leading zeros  
- No missing digits between dots  
- No extra dots (max 3 dots)  
- No invalid characters  

### 📜 **3. Real-Time Trace Logs**
Shows every detail:
- Character being read  
- Current state  
- Current octet  
- Octet-building progress  
- Reasons for rejection  
- Final acceptance message  

### 🪜 **4. Step-by-Step Execution Mode**
- Process input **one character at a time**  
- Great for teaching & presentations  
- Keyboard shortcuts:  
  - **Space** → Next Step  
  - **Enter** → Auto Run / Stop  
  - **R** → Reset  

### ⚡ **5. Auto Run Mode**
- Automatically executes the DFA with animations  
- Smooth, understandable transitions  

---

## 📂 Project Structure

📁 ipv4-dfa-visualizer
├── index.html # Main UI + DFA SVG diagram
├── style.css # Animations, transitions, UI styling
├── script.js # Full DFA logic + animation controls
├── README.md # Project documentation
└── assets/ # (Optional) Screenshots, diagrams


---

## 🧩 How It Works (Concept Overview)

The IPv4 DFA consists of these main states:

| State | Description |
|-------|-------------|
| **q0** | Start state (expecting digit) |
| **q1** | Reading digits of octet 1 |
| **q2** | After dot, expecting new octet |
| **q3** | Reading digits of octets 2–4 |
| **q4** | Accepting state |
| **dead** | Error state |

Each transition is shown through:
- Highlighted arrows  
- Animated glow dot  
- Real-time trace output  

---

## 🖥️ Running the Project

Just open `index.html` in any modern web browser:

index.html


No installation.  
No dependencies.  
No frameworks.  
Runs entirely in **HTML + CSS + JavaScript**.

---

## 🛠️ Technologies Used

- **HTML5**  
- **CSS3** (Keyframes, transitions, glow effects)  
- **JavaScript (Vanilla)**  
- **SVG Graphics** for DFA diagram  

---

## 🚀 Future Enhancements
- IPv6 DFA Visualizer  
- PDA / CFG versions  
- Export animation frames  
- Theme (Dark Mode)  
- Multi-language onboarding tutorial  

---

## 🤝 Contributing
Pull requests and enhancements are welcome.  
Feel free to fork this project and build your own automata visualizers!

---


---

## 💡 Acknowledgements
This visualization was created as part of an academic exploration of **Automata Theory**, showcasing how conceptual DFAs can be brought to life through modern web technologies.

