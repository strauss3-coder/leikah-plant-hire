import type { SafetyContent } from "@/lib/cms/types";

/* ============================================================================
   HEALTH, SAFETY, ENVIRONMENT & QUALITY

   Standards, procedures and controls describe how the business works and are
   the client's to state. Certifications and safety statistics are matters of
   record — they ship empty and are added in the portal once the certificates
   and the actual figures are to hand. Nothing here claims an accreditation.
   ========================================================================= */

export const safety: SafetyContent = {
  intro:
    "Heavy plant, live benches and a workshop full of stored energy do not forgive improvisation. Everything below exists because the alternative has a cost that no production target justifies.",
  commitment:
    "Every person who goes out on a Leikah crew goes home in the same condition they arrived. That is not a slogan on a wall — it is the reason work stops when a control is missing, and the reason a job that cannot be done safely does not get done at all. On a client's site, the client's standard governs; where ours is stricter, ours applies.",
  image: "fabrication-team-bowser",
  standards: [
    {
      id: "std-legal",
      title: "Legal compliance as the floor, not the target",
      description:
        "Work is carried out under the Occupational Health and Safety Act, and under the Mine Health and Safety Act where the operation is scheduled under it. Legal appointments, competencies and medicals are current and on file before a person is deployed.",
      icon: "book",
      order: 1,
    },
    {
      id: "std-client",
      title: "The client's standard governs on the client's site",
      description:
        "Method statements, risk assessments and permits are prepared to the requirements of your SHE department, in your template. Where our internal standard is stricter than yours, ours applies.",
      icon: "clipboard",
      order: 2,
    },
    {
      id: "std-authority",
      title: "Anyone can stop the job",
      description:
        "Every employee has the authority to stop work when a control is missing or a condition changes, without needing permission and without consequence. Work resumes when the control is back in place, not when the pressure lifts.",
      icon: "hardhat",
      order: 3,
    },
    {
      id: "std-isolation",
      title: "Isolation before every task, without exception",
      description:
        "No work begins on a machine until it is isolated and locked out and stored energy is released. Raised implements are supported mechanically, never on hydraulics alone.",
      icon: "shield",
      order: 4,
    },
    {
      id: "std-competence",
      title: "Competence is verified, not assumed",
      description:
        "Operators and technicians are deployed only onto equipment and tasks they hold current competency for. Certificates are tracked to expiry and renewed before they lapse.",
      icon: "gauge",
      order: 5,
    },
    {
      id: "std-environment",
      title: "Containment before the work, not after the spill",
      description:
        "Spill kits are deployed before any line, filter or drain plug is opened. Waste oil, coolant, filters and rags are captured and disposed of through licensed contractors with certificates retained.",
      icon: "leaf",
      order: 6,
    },
  ],
  procedures: [
    {
      title: "Before mobilisation",
      items: [
        "Site-specific risk assessment and method statement prepared and submitted for client approval",
        "Health and safety file compiled in the client's template with all supporting certificates",
        "Operator and technician competencies, medicals and legal appointments verified as current",
        "Plant inspected, safety equipment checked and fire suppression certified",
        "Insurance certificates and public liability cover confirmed in writing",
      ],
    },
    {
      title: "On arrival at site",
      items: [
        "Site induction completed by every person before entering the working area",
        "Permits obtained — general work, hot work, confined space or working at height as applicable",
        "Emergency procedures, assembly points and reporting lines confirmed with the site contact",
        "Traffic management and pedestrian segregation agreed before plant moves",
        "Services located and proved before any excavation begins",
      ],
    },
    {
      title: "During the work",
      items: [
        "Pre-start inspection logged per machine, with defects locked out until repaired",
        "Isolation and lock-out applied before any maintenance task, without exception",
        "Exclusion zones and spotters wherever plant works near people, services or structures",
        "Toolbox talk at shift start covering the day's specific hazards, not a generic list",
        "Work stopped on any change in condition until the control is reassessed",
      ],
    },
    {
      title: "After the work",
      items: [
        "Area cleared, waste removed and containment recovered before demobilisation",
        "Job card and fault report completed and issued to the client",
        "Incidents and near misses reported, investigated to root cause and closed out with verified corrective action",
        "Disposal certificates retained and made available for the client's environmental file",
      ],
    },
  ],
  training: [
    {
      title: "Site and client induction",
      description:
        "Every operator and technician completes the client's induction before entering a working area, refreshed to the operation's own cycle.",
      frequency: "Per site, per cycle",
    },
    {
      title: "Machine competency",
      description:
        "Operators hold current competency certificates for each machine class they run, verified and tracked to expiry.",
      frequency: "Renewed before expiry",
    },
    {
      title: "First aid and emergency response",
      description:
        "Trained first aiders on crews working remote sites, with emergency procedures rehearsed rather than filed.",
      frequency: "Annual refresher",
    },
    {
      title: "Fire fighting and hot work",
      description:
        "Basic fire fighting for workshop and field crews, with fire watch training for anyone carrying out hot work.",
      frequency: "Annual refresher",
    },
    {
      title: "Working at height and lifting",
      description:
        "Fall protection and rigging awareness for crews servicing large plant decks and handling heavy components.",
      frequency: "Annual refresher",
    },
    {
      title: "Hazard identification and toolbox talks",
      description:
        "Short, task-specific hazard briefings at the start of every shift, covering the actual work rather than a generic checklist.",
      frequency: "Every shift",
    },
  ],
  ppe: [
    "Hard hat, safety footwear and high-visibility clothing as a minimum on every site",
    "Eye protection for all grinding, cutting, welding and pressurised system work",
    "Hearing protection in designated zones and during all plant operation",
    "Cut-resistant gloves matched to the task — handling, chemical and welding",
    "Respiratory protection for fabrication, fume and dust exposure",
    "Fall protection where work is carried out on plant decks and elevated surfaces",
    "Flame-resistant workwear for hot work and fuel handling",
    "PPE issued, recorded and replaced on condition rather than on request",
  ],
  environmental: [
    "Spill containment deployed before any hydraulic, fuel, oil or coolant line is opened",
    "Used oil, coolant, filters and contaminated rags captured on site and removed for licensed disposal",
    "Disposal certificates retained and issued for the client's environmental file",
    "Dust suppression maintained on haul routes, load-out points and tipping areas",
    "Topsoil stripped, stockpiled and protected separately to keep rehabilitation viable",
    "Discharge from dewatering routed to the point the client's water management plan specifies",
    "Noise controls observed on sites adjacent to occupied property",
    "Environmental authorisation conditions briefed to every operator on the crew",
  ],
  riskManagement: [
    "Baseline risk assessment per site, revised whenever conditions or scope change",
    "Task-based risk assessment before any non-routine work begins",
    "Change control on any deviation from an approved sequence or method",
    "Geotechnical parameters observed absolutely — work stops on any deviation pending clearance",
    "Traffic management plans agreed with the operation before plant moves on a live route",
    "Emergency and evacuation procedures confirmed with the site contact on arrival",
    "Incident investigation to root cause, with corrective actions verified rather than assumed closed",
  ],
  qualityAssurance: [
    "Workshop rebuilds carried out against a documented strip report and approved scope",
    "Torque, clearance, backlash and end-float recorded on a signed build sheet at every critical joint",
    "Welding to written procedure by coded welders, with material certificates retained",
    "Non-destructive testing on structural repairs before and after the work",
    "Calibrated measuring and torque equipment, with calibration tracked to due date",
    "Earthworks volumes reconciled to the client surveyor's pick-up, not to our own count",
    "As-built survey and level records handed over with every earthworks completion",
  ],
  certifications: [],
  stats: [],
};
