import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";
import NBASidebar from "../Pages/NBASidebar";

import {
  FaArrowLeft,
  FaArrowRight,
  FaSave,
  FaTrash,
  FaPrint,
  FaBroom,
  FaUpload,
  FaEye,
  FaDownload,
  FaCalculator,
  FaCheckCircle,
  FaFileAlt,
  FaTimes,
} from "react-icons/fa";

import "./AttainmentPOPSO.css";

/* =========================================================
   STORAGE KEYS
========================================================= */

const STORAGE_KEY = "criteria3_8_attainment_v2";

const COURSE_ATTAINMENT_KEY =
  "nba_3_7_2_course_outcome_attainment";

/*
  IndexedDB is used for actual documentary files.
  localStorage stores only metadata/calculation data.
*/
const EVIDENCE_DB_NAME = "NBA_Criteria3_8_Evidence_DB";
const EVIDENCE_DB_VERSION = 1;
const EVIDENCE_STORE = "evidenceFiles";

/* =========================================================
   ATTAINMENT SCALE
========================================================= */

const LEVEL_SCALE = [
  {
    level: 0,
    min: 0,
    max: 0.5,
    label: "Not Attained",
  },
  {
    level: 1,
    min: 0.51,
    max: 1.5,
    label: "Slightly Attained",
  },
  {
    level: 2,
    min: 1.51,
    max: 2.5,
    label: "Moderately Attained",
  },
  {
    level: 3,
    min: 2.51,
    max: 3.5,
    label: "Substantially Attained",
  },
  {
    level: 4,
    min: 3.51,
    max: 4,
    label: "Fully Attained",
  },
];

const PO_LIST = Array.from(
  { length: 12 },
  (_, i) => `PO${i + 1}`
);

const PSO_LIST = [
  "PSO1",
  "PSO2",
  "PSO3",
];

const CO_LIST = [
  "CO1",
  "CO2",
  "CO3",
  "CO4",
  "CO5",
];

/* =========================================================
   EVIDENCE ITEMS
========================================================= */

const EVIDENCE_ITEMS = [
  [
    "courseCOAttainment",
    "Core Course CO Attainment Sheets",
    "CO attainment from core courses",
  ],
  [
    "studentResults",
    "Student Assessment / Result Records",
    "Student performance and result evidence",
  ],
  [
    "mappingDocuments",
    "CO–PO / CO–PSO Mapping Documents",
    "Mapping correlation evidence",
  ],
  [
    "internalResults",
    "Internal Assessment Results",
    "Internal assessment evidence",
  ],
  [
    "externalResults",
    "End Semester / External Results",
    "External examination evidence",
  ],
  [
    "calculationSheets",
    "PO / PSO Calculation Sheets",
    "Attainment calculation evidence",
  ],
  [
    "poDocuments",
    "PO Attainment Documentary Evidence",
    "PO level verification evidence",
  ],
  [
    "psoDocuments",
    "PSO Attainment Documentary Evidence",
    "PSO level verification evidence",
  ],
];

/* =========================================================
   HELPERS
========================================================= */

const getAttainmentLevel = (value) => {
  const v = Math.max(
    0,
    Math.min(4, Number(value) || 0)
  );

  if (v <= 0.5) {
    return LEVEL_SCALE[0];
  }

  if (v <= 1.5) {
    return LEVEL_SCALE[1];
  }

  if (v <= 2.5) {
    return LEVEL_SCALE[2];
  }

  if (v <= 3.5) {
    return LEVEL_SCALE[3];
  }

  return LEVEL_SCALE[4];
};

const createInitialEvidence = () =>
  EVIDENCE_ITEMS.reduce(
    (acc, [key]) => {
      acc[key] = false;
      return acc;
    },
    {}
  );

const createInitialIndirect = () =>
  [...PO_LIST, ...PSO_LIST].reduce(
    (acc, item) => {
      acc[item] = 2.0;
      return acc;
    },
    {}
  );

const createInitialTargets = () =>
  [...PO_LIST, ...PSO_LIST].reduce(
    (acc, item) => {
      acc[item] = 2.0;
      return acc;
    },
    {}
  );

const createInitialActions = () =>
  [...PO_LIST, ...PSO_LIST].reduce(
    (acc, item) => {
      acc[item] = {
        actionTaken: "",
        improvementRequired: "",
        decision: "",
      };
      return acc;
    },
    {}
  );

/* =========================================================
   DEFAULT CO-PO / CO-PSO MAPPING
========================================================= */

const createDefaultMapping = () => ({
  CO1: {
    PO1: 3,
    PO2: 2,
    PO3: 2,
    PO4: 1,
    PO5: 1,
    PO6: 0,
    PO7: 0,
    PO8: 0,
    PO9: 1,
    PO10: 1,
    PO11: 1,
    PO12: 1,
    PSO1: 3,
    PSO2: 2,
    PSO3: 1,
  },

  CO2: {
    PO1: 3,
    PO2: 3,
    PO3: 2,
    PO4: 2,
    PO5: 2,
    PO6: 0,
    PO7: 0,
    PO8: 1,
    PO9: 1,
    PO10: 1,
    PO11: 1,
    PO12: 1,
    PSO1: 3,
    PSO2: 2,
    PSO3: 2,
  },

  CO3: {
    PO1: 2,
    PO2: 2,
    PO3: 3,
    PO4: 2,
    PO5: 2,
    PO6: 1,
    PO7: 0,
    PO8: 0,
    PO9: 1,
    PO10: 1,
    PO11: 1,
    PO12: 1,
    PSO1: 2,
    PSO2: 3,
    PSO3: 2,
  },

  CO4: {
    PO1: 3,
    PO2: 2,
    PO3: 2,
    PO4: 3,
    PO5: 2,
    PO6: 1,
    PO7: 1,
    PO8: 1,
    PO9: 1,
    PO10: 1,
    PO11: 2,
    PO12: 2,
    PSO1: 3,
    PSO2: 2,
    PSO3: 2,
  },

  CO5: {
    PO1: 2,
    PO2: 2,
    PO3: 3,
    PO4: 2,
    PO5: 2,
    PO6: 1,
    PO7: 1,
    PO8: 1,
    PO9: 1,
    PO10: 1,
    PO11: 2,
    PO12: 2,
    PSO1: 3,
    PSO2: 2,
    PSO3: 2,
  },
});

/* =========================================================
   INDEXED DB
========================================================= */

const openEvidenceDB = () =>
  new Promise((resolve, reject) => {
    const request = indexedDB.open(
      EVIDENCE_DB_NAME,
      EVIDENCE_DB_VERSION
    );

    request.onupgradeneeded = () => {
      const db = request.result;

      if (!db.objectStoreNames.contains(EVIDENCE_STORE)) {
        db.createObjectStore(EVIDENCE_STORE, {
          keyPath: "key",
        });
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });

const saveEvidenceToDB = async (key, file) => {
  if (!file) return;

  const db = await openEvidenceDB();

  await new Promise((resolve, reject) => {
    const transaction = db.transaction(
      EVIDENCE_STORE,
      "readwrite"
    );

    const store =
      transaction.objectStore(EVIDENCE_STORE);

    store.put({
      key,
      name: file.name,
      type: file.type,
      size: file.size,
      lastModified: file.lastModified,
      file,
      savedAt: new Date().toISOString(),
    });

    transaction.oncomplete = () => resolve();
    transaction.onerror = () =>
      reject(transaction.error);
  });

  db.close();
};

const getEvidenceFromDB = async (key) => {
  const db = await openEvidenceDB();

  const result = await new Promise(
    (resolve, reject) => {
      const transaction = db.transaction(
        EVIDENCE_STORE,
        "readonly"
      );

      const store =
        transaction.objectStore(EVIDENCE_STORE);

      const request = store.get(key);

      request.onsuccess = () => {
        resolve(request.result || null);
      };

      request.onerror = () => {
        reject(request.error);
      };
    }
  );

  db.close();

  return result;
};

const deleteEvidenceFromDB = async (key) => {
  const db = await openEvidenceDB();

  await new Promise((resolve, reject) => {
    const transaction = db.transaction(
      EVIDENCE_STORE,
      "readwrite"
    );

    const store =
      transaction.objectStore(EVIDENCE_STORE);

    store.delete(key);

    transaction.oncomplete = () => resolve();
    transaction.onerror = () =>
      reject(transaction.error);
  });

  db.close();
};

const clearEvidenceDB = async () => {
  const db = await openEvidenceDB();

  await new Promise((resolve, reject) => {
    const transaction = db.transaction(
      EVIDENCE_STORE,
      "readwrite"
    );

    transaction.objectStore(
      EVIDENCE_STORE
    ).clear();

    transaction.oncomplete = () => resolve();
    transaction.onerror = () =>
      reject(transaction.error);
  });

  db.close();
};

/* =========================================================
   COURSE AVERAGE
========================================================= */

const getCourseAverage = (course) => {
  const values = CO_LIST.map(
    (co) =>
      Number(
        course?.[co.toLowerCase()]
      ) || 0
  );

  if (!values.length) {
    return 0;
  }

  return (
    values.reduce(
      (sum, value) =>
        sum + value,
      0
    ) / values.length
  );
};

/* =========================================================
   NORMALIZE COURSE
========================================================= */

const normalizeCourse = (
  course,
  index = 0
) => {
  if (!course) {
    return null;
  }

  return {
    ...course,

    id:
      course.id ||
      `${course.code || "COURSE"}-${index}`,

    code:
      course.code ||
      course.courseCode ||
      `COURSE-${index + 1}`,

    name:
      course.name ||
      course.courseName ||
      "Course",

    type:
      course.type ||
      "Core",

    co1:
      Number(course.co1) || 0,

    co2:
      Number(course.co2) || 0,

    co3:
      Number(course.co3) || 0,

    co4:
      Number(course.co4) || 0,

    co5:
      Number(course.co5) || 0,
  };
};

/* =========================================================
   NORMALIZE COURSES
========================================================= */

const normalizeCourses = (
  courseList
) => {
  if (!Array.isArray(courseList)) {
    return [];
  }

  return courseList
    .map((course, index) =>
      normalizeCourse(
        course,
        index
      )
    )
    .filter(Boolean);
};

/* =========================================================
   MERGE MAPPING
========================================================= */

const mergeMappingWithDefaults = (
  savedMapping
) => {
  const defaults =
    createDefaultMapping();

  if (!savedMapping) {
    return defaults;
  }

  return CO_LIST.reduce(
    (result, co) => {
      result[co] = {
        ...defaults[co],
        ...(savedMapping[co] || {}),
      };

      return result;
    },
    {}
  );
};

/* =========================================================
   CONVERT 3.7.2 RECORDS → 3.8 COURSES
========================================================= */

const convert37RecordsToCourses = (
  records
) => {
  if (!Array.isArray(records)) {
    return [];
  }

  const courses = [];

  records.forEach(
    (record, index) => {
      if (!record) return;

      const coData =
        Array.isArray(
          record.coData
        )
          ? record.coData
          : [];

      const findCO = (
        coName
      ) => {
        const found =
          coData.find(
            (item) =>
              item?.co ===
              coName
          );

        if (!found) {
          return 0;
        }

        return (
          Number(
            found.final
          ) || 0
        );
      };

      courses.push({
        id:
          record.id ||
          `${record.courseCode || "COURSE"}-${index}`,

        code:
          record.courseCode ||
          `COURSE-${index + 1}`,

        name:
          record.courseName ||
          "Course",

        type: "Core",

        co1: findCO("CO1"),
        co2: findCO("CO2"),
        co3: findCO("CO3"),
        co4: findCO("CO4"),
        co5: findCO("CO5"),

        source37_2: true,

        academicYear:
          record.academicYear ||
          "",

        semester:
          record.semester ||
          "",

        faculty:
          record.faculty ||
          "",
      });
    }
  );

  return normalizeCourses(
    courses
  );
};

/* =========================================================
   COMPONENT
========================================================= */

function AttainmentPOPSO() {
  const navigate =
    useNavigate();

  const fileInputRef =
    useRef(null);

  const [
    academicYear,
    setAcademicYear,
  ] = useState("2023-24");

  const [
    department,
    setDepartment,
  ] = useState(
    "Computer Engineering"
  );

  const [
    program,
    setProgram,
  ] = useState(
    "B.E. Computer Engineering"
  );

  /*
    IMPORTANT:
    No hard-coded course data.
    Actual 3.7.2 records are loaded.
  */
  const [
    courses,
    setCourses,
  ] = useState([]);

  const [
    mapping,
    setMapping,
  ] = useState(
    createDefaultMapping()
  );

  const [
    directWeight,
    setDirectWeight,
  ] = useState(80);

  const [
    indirectWeight,
    setIndirectWeight,
  ] = useState(20);

  const [
    indirectAttainment,
    setIndirectAttainment,
  ] = useState(
    createInitialIndirect()
  );

  const [
    targets,
    setTargets,
  ] = useState(
    createInitialTargets()
  );

  /*
    IMPORTANT:
    Initially blank.
    User must manually verify minimum
    two PO and two PSO attainment levels.
  */
  const [
    verifiedPOLevels,
    setVerifiedPOLevels,
  ] = useState([]);

  const [
    verifiedPSOLevels,
    setVerifiedPSOLevels,
  ] = useState([]);

  const [
    evidence,
    setEvidence,
  ] = useState(
    createInitialEvidence()
  );

  const [
    evidenceFiles,
    setEvidenceFiles,
  ] = useState({});

  const [
    evidenceFileNames,
    setEvidenceFileNames,
  ] = useState({});

  const [
    selectedFile,
    setSelectedFile,
  ] = useState(null);

  const [
    saved,
    setSaved,
  ] = useState(false);

  const [
    loadedFrom37_2,
    setLoadedFrom37_2,
  ] = useState(false);

  /*
    New evaluation/decision-making data.
  */
  const [
    actionPlans,
    setActionPlans,
  ] = useState(
    createInitialActions()
  );

  /* =======================================================
     LOAD SAVED 3.8 + 3.7.2 DATA
  ======================================================= */

  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      try {
        /*
          First read existing 3.8 data.
        */

        const raw38 =
          localStorage.getItem(
            STORAGE_KEY
          );

        if (raw38 && mounted) {
          const data =
            JSON.parse(raw38);

          if (data.academicYear) {
            setAcademicYear(
              data.academicYear
            );
          }

          if (data.department) {
            setDepartment(
              data.department
            );
          }

          if (data.program) {
            setProgram(
              data.program
            );
          }

          /*
            Only load saved courses if they are
            genuinely marked as 3.7.2 sourced.
          */
          if (
            Array.isArray(
              data.courses
            ) &&
            data.courses.length > 0
          ) {
            const savedCourses =
              normalizeCourses(
                data.courses
              );

            if (
              savedCourses.every(
                (course) =>
                  course.source37_2 === true
              )
            ) {
              setCourses(
                savedCourses
              );
            }
          }

          if (data.mapping) {
            setMapping(
              mergeMappingWithDefaults(
                data.mapping
              )
            );
          }

          if (
            Number.isFinite(
              Number(
                data.directWeight
              )
            )
          ) {
            setDirectWeight(
              Number(
                data.directWeight
              )
            );
          }

          if (
            Number.isFinite(
              Number(
                data.indirectWeight
              )
            )
          ) {
            setIndirectWeight(
              Number(
                data.indirectWeight
              )
            );
          }

          if (
            data.indirectAttainment
          ) {
            setIndirectAttainment(
              data.indirectAttainment
            );
          }

          if (data.targets) {
            setTargets(
              data.targets
            );
          }

          /*
            Old automatically selected [2,3]
            values are NOT trusted.
            Only manually confirmed saved
            verification is restored.
          */
          if (
            data.verificationManuallyConfirmed
          ) {
            if (
              Array.isArray(
                data.verifiedPOLevels
              )
            ) {
              setVerifiedPOLevels(
                data.verifiedPOLevels
              );
            }

            if (
              Array.isArray(
                data.verifiedPSOLevels
              )
            ) {
              setVerifiedPSOLevels(
                data.verifiedPSOLevels
              );
            }
          }

          if (data.evidence) {
            setEvidence(
              data.evidence
            );
          }

          if (
            data.evidenceFileNames
          ) {
            setEvidenceFileNames(
              data.evidenceFileNames
            );
          }

          if (data.actionPlans) {
            setActionPlans(
              {
                ...createInitialActions(),
                ...data.actionPlans,
              }
            );
          }

          setSaved(true);
        }

        /*
          Load actual 3.7.2 data.
        */

        const raw37 =
          localStorage.getItem(
            COURSE_ATTAINMENT_KEY
          );

        if (raw37 && mounted) {
          const data37 =
            JSON.parse(raw37);

          const converted =
            convert37RecordsToCourses(
              data37.records
            );

          /*
            Actual 3.7.2 records are the
            only source of course attainment.
          */
          if (
            converted.length > 0
          ) {
            setCourses(
              converted
            );

            setLoadedFrom37_2(
              true
            );

            if (
              data37.course
                ?.academicYear
            ) {
              setAcademicYear(
                data37.course
                  .academicYear
              );
            }

            if (
              data37.course
                ?.department
            ) {
              setDepartment(
                data37.course
                  .department
              );
            }
          }
        }

        /*
          Restore evidence files from IndexedDB.
        */
        const restoredFiles = {};
        const restoredNames = {};

        for (
          const [
            key,
            documentName,
          ] of EVIDENCE_ITEMS
        ) {
          const stored =
            await getEvidenceFromDB(
              key
            );

          if (
            stored?.file
          ) {
            restoredFiles[key] =
              stored.file;

            restoredNames[key] =
              stored.name ||
              documentName;
          }
        }

        if (mounted) {
          setEvidenceFiles(
            restoredFiles
          );

          setEvidenceFileNames(
            restoredNames
          );
        }
      } catch (error) {
        console.error(
          "Could not load Criteria 3.8 / 3.7.2 data:",
          error
        );
      }
    };

    loadData();

    return () => {
      mounted = false;
    };
  }, []);

  /* =======================================================
     OVERALL CO ATTAINMENT
  ======================================================= */

  const overallCOAttainment =
    useMemo(() => {
      if (!courses.length) {
        return 0;
      }

      return (
        courses.reduce(
          (sum, course) =>
            sum +
            getCourseAverage(
              course
            ),
          0
        ) / courses.length
      );
    }, [courses]);

  /* =======================================================
     DIRECT PO / PSO CALCULATION
  ======================================================= */

  const directResults =
    useMemo(() => {
      const calculate =
        (outcome) => {
          let weightedTotal = 0;
          let mappingTotal = 0;

          courses.forEach(
            (course) => {
              CO_LIST.forEach(
                (co) => {
                  const mapValue =
                    Number(
                      mapping?.[
                        co
                      ]?.[
                        outcome
                      ]
                    ) || 0;

                  const coValue =
                    Number(
                      course[
                        co.toLowerCase()
                      ]
                    ) || 0;

                  if (
                    mapValue > 0
                  ) {
                    weightedTotal +=
                      coValue *
                      mapValue;

                    mappingTotal +=
                      mapValue;
                  }
                }
              );
            }
          );

          return mappingTotal >
            0
            ? weightedTotal /
                mappingTotal
            : 0;
        };

      return [
        ...PO_LIST,
        ...PSO_LIST,
      ].reduce(
        (
          acc,
          outcome
        ) => {
          acc[outcome] =
            Number(
              calculate(
                outcome
              ).toFixed(2)
            );

          return acc;
        },
        {}
      );
    }, [
      courses,
      mapping,
    ]);

  /* =======================================================
     OVERALL RESULTS
  ======================================================= */

  const overallResults =
    useMemo(() => {
      return [
        ...PO_LIST,
        ...PSO_LIST,
      ].reduce(
        (
          acc,
          outcome
        ) => {
          const direct =
            Number(
              directResults[
                outcome
              ]
            ) || 0;

          const indirect =
            Number(
              indirectAttainment[
                outcome
              ]
            ) || 0;

          const overall =
            (
              direct *
                directWeight +
              indirect *
                indirectWeight
            ) / 100;

          const target =
            Number(
              targets[
                outcome
              ]
            ) || 0;

          acc[outcome] = {
            direct,

            indirect,

            overall:
              Number(
                overall.toFixed(
                  2
                )
              ),

            level:
              getAttainmentLevel(
                overall
              ),

            target,

            gap:
              Number(
                (
                  overall -
                  target
                ).toFixed(2)
              ),

            achieved:
              overall >=
              target,
          };

          return acc;
        },
        {}
      );
    }, [
      directResults,
      indirectAttainment,
      directWeight,
      indirectWeight,
      targets,
    ]);

  /* =======================================================
     OVERALL PO
  ======================================================= */

  const overallPO =
    useMemo(() => {
      if (!PO_LIST.length) {
        return 0;
      }

      return (
        PO_LIST.reduce(
          (sum, po) =>
            sum +
            overallResults[
              po
            ].overall,
          0
        ) / PO_LIST.length
      );
    }, [overallResults]);

  /* =======================================================
     OVERALL PSO
  ======================================================= */

  const overallPSO =
    useMemo(() => {
      if (!PSO_LIST.length) {
        return 0;
      }

      return (
        PSO_LIST.reduce(
          (sum, pso) =>
            sum +
            overallResults[
              pso
            ].overall,
          0
        ) / PSO_LIST.length
      );
    }, [overallResults]);

  const overallPOLevel =
    getAttainmentLevel(
      overallPO
    );

  const overallPSOLevel =
    getAttainmentLevel(
      overallPSO
    );

  /* =======================================================
     DISTRIBUTION
  ======================================================= */

  const levelDistribution =
    useMemo(() => {
      return [0, 1, 2, 3, 4].map(
        (level) => ({
          level,

          po: PO_LIST.filter(
            (po) =>
              overallResults[
                po
              ].level.level ===
              level
          ).length,

          pso: PSO_LIST.filter(
            (pso) =>
              overallResults[
                pso
              ].level.level ===
              level
          ).length,
        })
      );
    }, [overallResults]);

  /* =======================================================
     VALIDATIONS
  ======================================================= */

  const verifiedEvidenceCount =
    Object.values(
      evidence
    ).filter(Boolean).length;

  /*
    Evidence is valid only if:
    1. file exists
    2. verification checkbox is checked
  */
  const evidenceVerificationComplete =
    EVIDENCE_ITEMS.every(
      ([key]) =>
        Boolean(
          evidence[key]
        ) &&
        Boolean(
          evidenceFiles[key]
        )
    );

  const minimumVerificationComplete =
    verifiedPOLevels.length >=
      2 &&
    verifiedPSOLevels.length >=
      2;

  const weightageValid =
    Number(directWeight) +
      Number(indirectWeight) ===
    100;

  const coreCourseDataComplete =
    courses.length > 0 &&
    courses.every(
      (course) =>
        course.source37_2 === true
    );

  const poTargetCount =
    PO_LIST.filter(
      (po) =>
        overallResults[
          po
        ].achieved
    ).length;

  const psoTargetCount =
    PSO_LIST.filter(
      (pso) =>
        overallResults[
          pso
        ].achieved
    ).length;

  /* =======================================================
     COURSE CHANGE
  ======================================================= */

  const handleCourseChange = (
    index,
    field,
    value
  ) => {
    let number =
      Number(value);

    if (
      Number.isNaN(number)
    ) {
      number = 0;
    }

    number = Math.max(
      0,
      Math.min(4, number)
    );

    setCourses(
      (previous) =>
        previous.map(
          (
            course,
            i
          ) =>
            i === index
              ? {
                  ...course,
                  [field]:
                    number,
                }
              : course
        )
    );

    setSaved(false);
  };

  /* =======================================================
     MAPPING CHANGE
  ======================================================= */

  const handleMappingChange = (
    co,
    outcome,
    value
  ) => {
    setMapping(
      (previous) => ({
        ...previous,

        [co]: {
          ...(previous[
            co
          ] || {}),

          [outcome]:
            Number(value),
        },
      })
    );

    setSaved(false);
  };

  /* =======================================================
     INDIRECT CHANGE
  ======================================================= */

  const handleIndirectChange = (
    outcome,
    value
  ) => {
    let number =
      Number(value);

    if (
      Number.isNaN(number)
    ) {
      number = 0;
    }

    number = Math.max(
      0,
      Math.min(4, number)
    );

    setIndirectAttainment(
      (previous) => ({
        ...previous,
        [outcome]:
          number,
      })
    );

    setSaved(false);
  };

  /* =======================================================
     TARGET CHANGE
  ======================================================= */

  const handleTargetChange = (
    outcome,
    value
  ) => {
    let number =
      Number(value);

    if (
      Number.isNaN(number)
    ) {
      number = 0;
    }

    number = Math.max(
      0,
      Math.min(4, number)
    );

    setTargets(
      (previous) => ({
        ...previous,
        [outcome]:
          number,
      })
    );

    setSaved(false);
  };

  /* =======================================================
     WEIGHTAGE
  ======================================================= */

  const handleDirectWeightChange =
    (value) => {
      let number =
        Number(value);

      if (
        Number.isNaN(number)
      ) {
        number = 0;
      }

      number = Math.max(
        0,
        Math.min(100, number)
      );

      setDirectWeight(
        number
      );

      setIndirectWeight(
        100 - number
      );

      setSaved(false);
    };

  /* =======================================================
     EVIDENCE CHECKBOX
  ======================================================= */

  const toggleEvidence = (
    key
  ) => {
    if (
      !evidenceFiles[key]
    ) {
      alert(
        "Please upload the documentary evidence file before verifying it."
      );
      return;
    }

    setEvidence(
      (previous) => ({
        ...previous,
        [key]:
          !previous[key],
      })
    );

    setSaved(false);
  };

  /* =======================================================
     PO LEVEL
  ======================================================= */

  const togglePOLevel = (
    level
  ) => {
    setVerifiedPOLevels(
      (previous) =>
        previous.includes(level)
          ? previous.filter(
              (item) =>
                item !== level
            )
          : [
              ...previous,
              level,
            ].sort(
              (a, b) =>
                a - b
            )
    );

    setSaved(false);
  };

  /* =======================================================
     PSO LEVEL
  ======================================================= */

  const togglePSOLevel = (
    level
  ) => {
    setVerifiedPSOLevels(
      (previous) =>
        previous.includes(level)
          ? previous.filter(
              (item) =>
                item !== level
            )
          : [
              ...previous,
              level,
            ].sort(
              (a, b) =>
                a - b
            )
    );

    setSaved(false);
  };

  /* =======================================================
     EVIDENCE FILE
  ======================================================= */

  const handleEvidenceFile = async (
    event,
    key
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      await saveEvidenceToDB(
        key,
        file
      );

      setEvidenceFiles(
        (previous) => ({
          ...previous,
          [key]: file,
        })
      );

      setEvidenceFileNames(
        (previous) => ({
          ...previous,
          [key]: file.name,
        })
      );

      setEvidence(
        (previous) => ({
          ...previous,
          [key]: false,
        })
      );

      setSaved(false);
    } catch (error) {
      console.error(
        "Evidence file save error:",
        error
      );

      alert(
        "Unable to save documentary evidence file."
      );
    }
  };

  /* =======================================================
     REMOVE EVIDENCE FILE
  ======================================================= */

  const handleRemoveEvidenceFile =
    async (key) => {
      try {
        await deleteEvidenceFromDB(
          key
        );
      } catch (error) {
        console.error(
          "Evidence delete error:",
          error
        );
      }

      setEvidenceFiles(
        (previous) => {
          const next = {
            ...previous,
          };

          delete next[key];

          return next;
        }
      );

      setEvidenceFileNames(
        (previous) => {
          const next = {
            ...previous,
          };

          delete next[key];

          return next;
        }
      );

      setEvidence(
        (previous) => ({
          ...previous,
          [key]: false,
        })
      );

      setSaved(false);
    };

  /* =======================================================
     VIEW EVIDENCE FILE
  ======================================================= */

  const viewEvidenceFile = async (
    key
  ) => {
    try {
      let file =
        evidenceFiles[key];

      if (!file) {
        const stored =
          await getEvidenceFromDB(
            key
          );

        file =
          stored?.file;
      }

      if (!file) {
        alert(
          "Documentary evidence file not found."
        );
        return;
      }

      const url =
        URL.createObjectURL(
          file
        );

      window.open(
        url,
        "_blank",
        "noopener,noreferrer"
      );

      setTimeout(
        () =>
          URL.revokeObjectURL(
            url
          ),
        60000
      );
    } catch (error) {
      console.error(
        "Evidence view error:",
        error
      );

      alert(
        "Unable to open the evidence file."
      );
    }
  };

  /* =======================================================
     DOWNLOAD EVIDENCE FILE
  ======================================================= */

  const downloadEvidenceFile =
    async (key) => {
      try {
        let file =
          evidenceFiles[key];

        if (!file) {
          const stored =
            await getEvidenceFromDB(
              key
            );

          file =
            stored?.file;
        }

        if (!file) {
          alert(
            "Documentary evidence file not found."
          );
          return;
        }

        const url =
          URL.createObjectURL(
            file
          );

        const link =
          document.createElement(
            "a"
          );

        link.href = url;
        link.download =
          file.name ||
          "evidence";

        document.body.appendChild(
          link
        );

        link.click();

        link.remove();

        setTimeout(
          () =>
            URL.revokeObjectURL(
              url
            ),
          1000
        );
      } catch (error) {
        console.error(
          "Evidence download error:",
          error
        );

        alert(
          "Unable to download the evidence file."
        );
      }
    };

  /* =======================================================
     EXTRA FILE
  ======================================================= */

  const handleSelectedFile = (
    event
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    setSelectedFile(
      file
    );

    setSaved(false);
  };

  const handleUploadClick =
    () => {
      fileInputRef.current?.click();
    };

  const openFile = (
    file
  ) => {
    if (!file) {
      alert(
        "Please choose a document first."
      );
      return;
    }

    const url =
      URL.createObjectURL(
        file
      );

    window.open(
      url,
      "_blank",
      "noopener,noreferrer"
    );

    setTimeout(
      () =>
        URL.revokeObjectURL(
          url
        ),
      60000
    );
  };

  const downloadFile = (
    file
  ) => {
    if (!file) {
      alert(
        "Please choose a document first."
      );
      return;
    }

    const url =
      URL.createObjectURL(
        file
      );

    const link =
      document.createElement(
        "a"
      );

    link.href = url;
    link.download =
      file.name;

    document.body.appendChild(
      link
    );

    link.click();

    link.remove();

    setTimeout(
      () =>
        URL.revokeObjectURL(
          url
        ),
      1000
    );
  };

  /* =======================================================
     ACTION PLAN / DECISION MAKING
  ======================================================= */

  const handleActionPlanChange = (
    outcome,
    field,
    value
  ) => {
    setActionPlans(
      (previous) => ({
        ...previous,

        [outcome]: {
          ...(previous[
            outcome
          ] || {}),

          [field]:
            value,
        },
      })
    );

    setSaved(false);
  };

  /* =======================================================
     SAVE
  ======================================================= */

  const handleSave = async () => {
    if (!coreCourseDataComplete) {
      alert(
        "No valid Criteria 3.7.2 core-course CO attainment data is available. Please complete Criteria 3.7.2 first."
      );
      return;
    }

    if (!weightageValid) {
      alert(
        "Direct + Indirect weightage must be exactly 100%."
      );
      return;
    }

    if (
      !minimumVerificationComplete
    ) {
      alert(
        "Please manually verify at least two PO levels and two PSO levels."
      );
      return;
    }

    if (
      !evidenceVerificationComplete
    ) {
      alert(
        "Please upload and verify all documentary evidence categories."
      );
      return;
    }

    const data = {
      academicYear,

      department,

      program,

      /*
        Actual 3.7.2 course records only.
      */
      courses:
        normalizeCourses(
          courses
        ),

      mapping:
        mergeMappingWithDefaults(
          mapping
        ),

      directWeight,

      indirectWeight,

      indirectAttainment,

      targets,

      directResults,

      overallResults,

      overallCOAttainment,

      overallPO,

      overallPSO,

      overallPOLevel,

      overallPSOLevel,

      verifiedPOLevels,

      verifiedPSOLevels,

      /*
        This flag ensures that the selected
        verification levels were manually
        completed before saving.
      */
      verificationManuallyConfirmed:
        true,

      evidence,

      evidenceFileNames,

      actionPlans,

      source:
        "Criteria 3.7.2",

      savedAt:
        new Date().toISOString(),
    };

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(data)
      );

      setSaved(true);

      alert(
        "Criteria 3.8 data saved successfully with documentary evidence, verification and attainment decision-making data."
      );
    } catch (error) {
      console.error(
        "Criteria 3.8 save error:",
        error
      );

      alert(
        "Unable to save Criteria 3.8 data."
      );
    }
  };

  /* =======================================================
     RESET
  ======================================================= */

  const resetState = () => {
    setAcademicYear(
      "2023-24"
    );

    setDepartment(
      "Computer Engineering"
    );

    setProgram(
      "B.E. Computer Engineering"
    );

    /*
      No sample/hard-coded courses.
      Courses will come from 3.7.2.
    */
    setCourses([]);

    setMapping(
      createDefaultMapping()
    );

    setDirectWeight(80);

    setIndirectWeight(20);

    setIndirectAttainment(
      createInitialIndirect()
    );

    setTargets(
      createInitialTargets()
    );

    /*
      IMPORTANT:
      Verification starts blank.
    */
    setVerifiedPOLevels([]);

    setVerifiedPSOLevels([]);

    setEvidence(
      createInitialEvidence()
    );

    setEvidenceFiles({});

    setEvidenceFileNames({});

    setSelectedFile(null);

    setActionPlans(
      createInitialActions()
    );

    setSaved(false);

    setLoadedFrom37_2(
      false
    );

    if (
      fileInputRef.current
    ) {
      fileInputRef.current.value =
        "";
    }
  };

  /* =======================================================
     DELETE
  ======================================================= */

  const handleDelete = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete saved Criteria 3.8 data and documentary evidence?"
      )
    ) {
      return;
    }

    localStorage.removeItem(
      STORAGE_KEY
    );

    try {
      await clearEvidenceDB();
    } catch (error) {
      console.error(
        "Evidence DB clear error:",
        error
      );
    }

    resetState();

    alert(
      "Criteria 3.8 saved data and documentary evidence deleted."
    );
  };

  /* =======================================================
     CLEAR
  ======================================================= */

  const handleClear = () => {
    if (
      !window.confirm(
        "Clear all current Criteria 3.8 entries?"
      )
    ) {
      return;
    }

    /*
      Do not delete saved documentary
      evidence during normal Clear.
    */
    resetState();
  };

  /* =======================================================
     PRINT
  ======================================================= */

  const handlePrint = () => {
    window.print();
  };

  const levelClass = (
    level
  ) =>
    `attainment-level level-${level}`;

  /* =======================================================
     RESULT TABLE
  ======================================================= */

  const renderAttainmentTable = (
    items,
    isPSO = false
  ) => (
    <div className="table-container">
      <table className="result-table">
        <thead>
          <tr>
            <th>
              {isPSO
                ? "PSO"
                : "PO"}
            </th>

            <th>
              Direct
            </th>

            <th>
              Indirect
            </th>

            <th>
              Overall
            </th>

            <th>
              Level
            </th>

            <th>
              Target
            </th>

            <th>
              Gap
            </th>

            <th>
              Status
            </th>
          </tr>
        </thead>

        <tbody>
          {items.map(
            (item) => {
              const result =
                overallResults[
                  item.outcome
                ];

              return (
                <tr
                  key={
                    item.outcome
                  }
                >
                  <td>
                    <strong>
                      {
                        item.outcome
                      }
                    </strong>
                  </td>

                  <td>
                    {result.direct.toFixed(
                      2
                    )}
                  </td>

                  <td>
                    {result.indirect.toFixed(
                      2
                    )}
                  </td>

                  <td className="value-cell">
                    {result.overall.toFixed(
                      2
                    )}
                  </td>

                  <td>
                    <span
                      className={levelClass(
                        result
                          .level
                          .level
                      )}
                    >
                      Level{" "}
                      {
                        result
                          .level
                          .level
                      }
                    </span>
                  </td>

                  <td>
                    {result.target.toFixed(
                      2
                    )}
                  </td>

                  <td
                    className={
                      result.gap >=
                      0
                        ? "gap-positive"
                        : "gap-negative"
                    }
                  >
                    {result.gap >=
                    0
                      ? "+"
                      : ""}

                    {result.gap.toFixed(
                      2
                    )}
                  </td>

                  <td>
                    <span
                      className={
                        result.achieved
                          ? "status-achieved"
                          : "status-pending"
                      }
                    >
                      {result.achieved
                        ? "Achieved"
                        : "Not Achieved"}
                    </span>
                  </td>
                </tr>
              );
            }
          )}
        </tbody>
      </table>
    </div>
  );

  /* =======================================================
     RETURN
  ======================================================= */

  return (
    <div className="criteria38-page">

      <NBASidebar />

      <main className="criteria38-content">

        {/* =================================================
            TITLE
        ================================================= */}

        <div className="criteria38-title">
          <h1>
            3.8. Attainment of Program Outcomes and Program Specific Outcomes
          </h1>
        </div>

        {/* =================================================
            3.7.2 CONNECTION STATUS
        ================================================= */}

        {loadedFrom37_2 && (
          <div
            className="verification-success"
            style={{
              marginBottom:
                "15px",
            }}
          >
            <FaCheckCircle />

            CO1–CO5 attainment data loaded
            automatically from Criteria 3.7.2.
          </div>
        )}

        {!loadedFrom37_2 && (
          <div
            className="verification-warning"
            style={{
              marginBottom:
                "15px",
            }}
          >
            <FaCheckCircle />

            Criteria 3.7.2 course attainment data is not loaded.
            Complete Criteria 3.7.2 before entering Criteria 3.8.
          </div>
        )}

        {/* =================================================
            DETAILS
        ================================================= */}

        <div className="details-card">

          <div className="detail-item">
            <label>
              Academic Year
            </label>

            <select
              value={
                academicYear
              }
              onChange={(e) =>
                setAcademicYear(
                  e.target.value
                )
              }
            >
              <option>
                2022-23
              </option>

              <option>
                2023-24
              </option>

              <option>
                2024-25
              </option>

              <option>
                2025-26
              </option>

              <option>
                2026-27
              </option>
            </select>
          </div>

          <div className="detail-item">
            <label>
              Department
            </label>

            <select
              value={
                department
              }
              onChange={(e) =>
                setDepartment(
                  e.target.value
                )
              }
            >
              <option>
                Computer Engineering
              </option>

              <option>
                Information Technology
              </option>

              <option>
                Electronics Engineering
              </option>
            </select>
          </div>

          <div className="detail-item">
            <label>
              Program
            </label>

            <select
              value={
                program
              }
              onChange={(e) =>
                setProgram(
                  e.target.value
                )
              }
            >
              <option>
                B.E. Computer Engineering
              </option>

              <option>
                B.E. Information Technology
              </option>

              <option>
                B.E. Electronics Engineering
              </option>

              <option>
                MCA
              </option>
            </select>
          </div>

          <div className="calculation-status">

            <FaCalculator />

            <div>
              <span>
                Automatic Calculation
              </span>

              <small>
                CO1–CO5 → PO/PSO →
                Direct + Indirect →
                Overall
              </small>
            </div>

          </div>

        </div>

        {/* =================================================
            SCALE
        ================================================= */}

        <div className="scale-card">

          <div className="card-heading">
            Attainment Level Scale
          </div>

          <div className="scale-grid">

            {LEVEL_SCALE.map(
              (item) => (
                <div
                  className={`scale-item scale-level-${item.level}`}
                  key={
                    item.level
                  }
                >
                  <strong>
                    Level{" "}
                    {
                      item.level
                    }
                  </strong>

                  <span>
                    {item.level ===
                    0
                      ? "0.00 – 0.50"
                      : item.level ===
                        4
                      ? ">3.50 – 4.00"
                      : `>${item.min.toFixed(
                          2
                        )} – ${item.max.toFixed(
                          2
                        )}`}
                  </span>

                  <small>
                    {
                      item.label
                    }
                  </small>
                </div>
              )
            )}

          </div>
        </div>

        {/* =================================================
            SECTION A
        ================================================= */}

        <div className="section-card">

          <div className="section-heading">

            <span className="section-letter">
              A
            </span>

            <div>
              Verification of Documents,
              Results and Level of
              Attainment of Each PO/PSO
            </div>

            <span className="section-marks">
              10 Marks
            </span>

          </div>

          {/* =================================================
              CORE COURSE CO ATTAINMENT
          ================================================= */}

          <div className="sub-section">

            <div className="sub-heading">
              1. Core Course CO Attainment
            </div>

            <div className="table-container">

              <table className="attainment-table">

                <thead>

                  <tr>

                    <th>
                      Sr.
                    </th>

                    <th>
                      Course Code
                    </th>

                    <th>
                      Course Name
                    </th>

                    <th>
                      Type
                    </th>

                    {CO_LIST.map(
                      (co) => (
                        <th
                          key={co}
                        >
                          {co}
                        </th>
                      )
                    )}

                    <th>
                      Course CO Attainment
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {courses.length ===
                  0 ? (
                    <tr>
                      <td
                        colSpan="10"
                        style={{
                          textAlign:
                            "center",
                        }}
                      >
                        No Criteria 3.7.2
                        course records
                        available.
                      </td>
                    </tr>
                  ) : (
                    courses.map(
                      (
                        course,
                        index
                      ) => (
                        <tr
                          key={
                            course.id ||
                            course.code
                          }
                        >

                          <td>
                            {
                              index +
                              1
                            }
                          </td>

                          <td>
                            <strong>
                              {
                                course.code
                              }
                            </strong>
                          </td>

                          <td className="course-name">
                            {
                              course.name
                            }
                          </td>

                          <td>
                            <span className="core-badge">
                              Core
                            </span>
                          </td>

                          {CO_LIST.map(
                            (co) => {
                              const field =
                                co.toLowerCase();

                              return (
                                <td
                                  key={
                                    co
                                  }
                                >
                                  <input
                                    type="number"
                                    min="0"
                                    max="4"
                                    step="0.01"
                                    value={
                                      Number(
                                        course[
                                          field
                                        ]
                                      ) ||
                                      0
                                    }
                                    onChange={(
                                      e
                                    ) =>
                                      handleCourseChange(
                                        index,
                                        field,
                                        e
                                          .target
                                          .value
                                      )
                                    }
                                  />
                                </td>
                              );
                            }
                          )}

                          <td className="calculated-cell">

                            {getCourseAverage(
                              course
                            ).toFixed(
                              2
                            )}

                          </td>

                        </tr>
                      )
                    )
                  )}

                  <tr className="summary-row">

                    <td colSpan="9">
                      Overall Average CO
                      Attainment
                    </td>

                    <td>
                      {overallCOAttainment.toFixed(
                        2
                      )}
                    </td>

                  </tr>

                </tbody>

              </table>

            </div>

          </div>

          {/* =================================================
              CO–PO / CO–PSO MAPPING
          ================================================= */}

          <div className="sub-section">

            <div className="sub-heading">
              2. CO–PO / CO–PSO Mapping
            </div>

            <div className="mapping-scroll">

              <table className="mapping-table">

                <thead>

                  <tr>

                    <th>
                      CO
                    </th>

                    {PO_LIST.map(
                      (po) => (
                        <th
                          key={po}
                        >
                          {po}
                        </th>
                      )
                    )}

                    {PSO_LIST.map(
                      (pso) => (
                        <th
                          key={pso}
                          className="pso-header"
                        >
                          {pso}
                        </th>
                      )
                    )}

                  </tr>

                </thead>

                <tbody>

                  {CO_LIST.map(
                    (co) => (
                      <tr
                        key={co}
                      >

                        <th>
                          {co}
                        </th>

                        {[
                          ...PO_LIST,
                          ...PSO_LIST,
                        ].map(
                          (
                            outcome
                          ) => (
                            <td
                              key={
                                outcome
                              }
                            >

                              <select
                                value={
                                  mapping?.[
                                    co
                                  ]?.[
                                    outcome
                                  ] ??
                                  0
                                }
                                onChange={(
                                  e
                                ) =>
                                  handleMappingChange(
                                    co,
                                    outcome,
                                    e
                                      .target
                                      .value
                                  )
                                }
                              >

                                <option value="0">
                                  0
                                </option>

                                <option value="1">
                                  1
                                </option>

                                <option value="2">
                                  2
                                </option>

                                <option value="3">
                                  3
                                </option>

                              </select>

                            </td>
                          )
                        )}

                      </tr>
                    )
                  )}

                </tbody>

              </table>

            </div>

            <div className="mapping-info">

              <span>
                <b>3</b> = Strong
              </span>

              <span>
                <b>2</b> = Moderate
              </span>

              <span>
                <b>1</b> = Weak
              </span>

              <span>
                <b>0</b> = No Correlation
              </span>

            </div>

          </div>

          {/* =================================================
              DIRECT PO
          ================================================= */}

          <div className="sub-section">

            <div className="sub-heading">
              3. Direct PO Attainment
              Calculation
            </div>

            <div className="formula-box">

              <strong>
                Direct PO Attainment =
              </strong>

              <span>
                Σ (CO Attainment ×
                Mapping Level) ÷ Σ
                Mapping Level
              </span>

            </div>

            <div className="table-container">

              <table className="result-table compact">

                <thead>

                  <tr>
                    <th>PO</th>
                    <th>
                      Direct Attainment
                    </th>
                    <th>Level</th>
                    <th>
                      Interpretation
                    </th>
                  </tr>

                </thead>

                <tbody>

                  {PO_LIST.map(
                    (po) => {
                      const level =
                        getAttainmentLevel(
                          directResults[
                            po
                          ]
                        );

                      return (
                        <tr
                          key={po}
                        >

                          <td>
                            <strong>
                              {po}
                            </strong>
                          </td>

                          <td className="value-cell">
                            {directResults[
                              po
                            ].toFixed(
                              2
                            )}
                          </td>

                          <td>

                            <span
                              className={levelClass(
                                level.level
                              )}
                            >
                              Level{" "}
                              {
                                level.level
                              }
                            </span>

                          </td>

                          <td>
                            {
                              level.label
                            }
                          </td>

                        </tr>
                      );
                    }
                  )}

                </tbody>

              </table>

            </div>

          </div>

          {/* =================================================
              DIRECT PSO
          ================================================= */}

          <div className="sub-section">

            <div className="sub-heading">
              4. Direct PSO Attainment
              Calculation
            </div>

            <div className="formula-box">

              <strong>
                Direct PSO Attainment =
              </strong>

              <span>
                Σ (CO Attainment ×
                Mapping Level) ÷ Σ
                Mapping Level
              </span>

            </div>

            <div className="table-container">

              <table className="result-table compact">

                <thead>

                  <tr>
                    <th>PSO</th>
                    <th>
                      Direct Attainment
                    </th>
                    <th>Level</th>
                    <th>
                      Interpretation
                    </th>
                  </tr>

                </thead>

                <tbody>

                  {PSO_LIST.map(
                    (pso) => {
                      const level =
                        getAttainmentLevel(
                          directResults[
                            pso
                          ]
                        );

                      return (
                        <tr
                          key={pso}
                        >

                          <td>
                            <strong>
                              {pso}
                            </strong>
                          </td>

                          <td className="value-cell">
                            {directResults[
                              pso
                            ].toFixed(
                              2
                            )}
                          </td>

                          <td>

                            <span
                              className={levelClass(
                                level.level
                              )}
                            >
                              Level{" "}
                              {
                                level.level
                              }
                            </span>

                          </td>

                          <td>
                            {
                              level.label
                            }
                          </td>

                        </tr>
                      );
                    }
                  )}

                </tbody>

              </table>

            </div>

          </div>

          {/* =================================================
              DOCUMENT VERIFICATION
          ================================================= */}

          <div className="sub-section">

            <div className="sub-heading">
              5. Documentary Verification
            </div>

            <div className="verification-summary">

              <div className="summary-badge">

                <FaCheckCircle />

                {
                  verifiedEvidenceCount
                }
                {" / "}
                {
                  EVIDENCE_ITEMS.length
                }
                {" "}
                Verified

              </div>

              <div className="summary-badge blue">

                <FaCalculator />

                Direct PO:
                {" "}
                {overallPO.toFixed(
                  2
                )}

              </div>

              <div className="summary-badge green">

                <FaCalculator />

                Direct PSO:
                {" "}
                {overallPSO.toFixed(
                  2
                )}

              </div>

            </div>

            <div className="table-container">

              <table className="document-verification-table">

                <thead>

                  <tr>

                    <th>
                      Sr.
                    </th>

                    <th>
                      Document / Evidence
                    </th>

                    <th>
                      Required Verification
                    </th>

                    <th>
                      Evidence File
                    </th>

                    <th>
                      Status
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {EVIDENCE_ITEMS.map(
                    (
                      [
                        key,
                        document,
                        requirement,
                      ],
                      index
                    ) => (
                      <tr
                        key={key}
                      >

                        <td>
                          {
                            index +
                            1
                          }
                        </td>

                        <td>
                          <strong>
                            {
                              document
                            }
                          </strong>
                        </td>

                        <td>
                          {
                            requirement
                          }
                        </td>

                        <td>

                          <label className="mini-upload">

                            <input
                              type="file"
                              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png"
                              onChange={(
                                e
                              ) =>
                                handleEvidenceFile(
                                  e,
                                  key
                                )
                              }
                            />

                            <FaUpload />

                            {evidenceFiles[
                              key
                            ]
                              ? "Replace"
                              : "Upload"}

                          </label>

                          {evidenceFiles[
                            key
                          ] && (
                            <div className="evidence-file-name">

                              <FaFileAlt />

                              <span>
                                {
                                  evidenceFileNames[
                                    key
                                  ] ||
                                  evidenceFiles[
                                    key
                                  ].name
                                }
                              </span>

                              <button
                                type="button"
                                className="view-button"
                                onClick={() =>
                                  viewEvidenceFile(
                                    key
                                  )
                                }
                              >
                                <FaEye />
                              </button>

                              <button
                                type="button"
                                className="download-button"
                                onClick={() =>
                                  downloadEvidenceFile(
                                    key
                                  )
                                }
                              >
                                <FaDownload />
                              </button>

                              <button
                                type="button"
                                className="remove-file-button"
                                onClick={() =>
                                  handleRemoveEvidenceFile(
                                    key
                                  )
                                }
                              >
                                <FaTimes />
                              </button>

                            </div>
                          )}

                        </td>

                        <td>

                          <label className="verify-checkbox">

                            <input
                              type="checkbox"
                              checked={Boolean(
                                evidence[
                                  key
                                ]
                              )}
                              onChange={() =>
                                toggleEvidence(
                                  key
                                )
                              }
                            />

                            <span
                              className={
                                evidence[
                                  key
                                ]
                                  ? "verified-status"
                                  : "pending-status"
                              }
                            >
                              {evidence[
                                key
                              ]
                                ? "Verified"
                                : "Pending"}
                            </span>

                          </label>

                        </td>

                      </tr>
                    )
                  )}

                </tbody>

              </table>

            </div>

            <div
              className={
                evidenceVerificationComplete
                  ? "verification-success"
                  : "verification-warning"
              }
            >

              <FaCheckCircle />

              {evidenceVerificationComplete
                ? "All documentary evidence categories are verified."
                : "Upload and verify all documentary evidence categories before final submission."}

            </div>

          </div>

        </div>

        {/* =================================================
            SECTION B
        ================================================= */}

        <div className="section-card">

          <div className="section-heading">

            <span className="section-letter">
              B
            </span>

            <div>
              Assessment of Overall
              Levels of Attainment
            </div>

            <span className="section-marks">
              15 Marks
            </span>

          </div>

          {/* =================================================
              WEIGHTAGE
          ================================================= */}

          <div className="sub-section">

            <div className="sub-heading">
              6. Direct + Indirect
              Attainment Assessment
            </div>

            <div className="weightage-card">

              <div>

                <label>
                  Direct Weightage (%)
                </label>

                <input
                  type="number"
                  min="0"
                  max="100"
                  value={
                    directWeight
                  }
                  onChange={(e) =>
                    handleDirectWeightChange(
                      e.target.value
                    )
                  }
                />

              </div>

              <div className="weightage-symbol">
                +
              </div>

              <div>

                <label>
                  Indirect Weightage (%)
                </label>

                <input
                  type="number"
                  value={
                    indirectWeight
                  }
                  readOnly
                />

              </div>

              <div
                className={
                  weightageValid
                    ? "weight-valid"
                    : "weight-invalid"
                }
              >
                {weightageValid
                  ? "100% Valid"
                  : "Must total 100%"}
              </div>

            </div>

            <div className="formula-box">

              <strong>
                Overall Attainment =
              </strong>

              <span>
                (Direct × Direct
                Weightage + Indirect ×
                Indirect Weightage) ÷ 100
              </span>

            </div>

            <div className="table-container">

              <table className="assessment-input-table">

                <thead>

                  <tr>

                    <th>
                      Outcome
                    </th>

                    <th>
                      Direct Attainment
                    </th>

                    <th>
                      Indirect Attainment
                    </th>

                    <th>
                      Target
                    </th>

                    <th>
                      Overall
                    </th>

                    <th>
                      Level
                    </th>

                    <th>
                      Gap
                    </th>

                    <th>
                      Status
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {[
                    ...PO_LIST,
                    ...PSO_LIST,
                  ].map(
                    (outcome) => {
                      const result =
                        overallResults[
                          outcome
                        ];

                      return (
                        <tr
                          key={
                            outcome
                          }
                        >

                          <td>
                            <strong>
                              {
                                outcome
                              }
                            </strong>
                          </td>

                          <td>
                            {result.direct.toFixed(
                              2
                            )}
                          </td>

                          <td>

                            <input
                              className="small-number-input"
                              type="number"
                              min="0"
                              max="4"
                              step="0.01"
                              value={
                                indirectAttainment[
                                  outcome
                                ]
                              }
                              onChange={(
                                e
                              ) =>
                                handleIndirectChange(
                                  outcome,
                                  e
                                    .target
                                    .value
                                )
                              }
                            />

                          </td>

                          <td>

                            <input
                              className="small-number-input"
                              type="number"
                              min="0"
                              max="4"
                              step="0.01"
                              value={
                                targets[
                                  outcome
                                ]
                              }
                              onChange={(
                                e
                              ) =>
                                handleTargetChange(
                                  outcome,
                                  e
                                    .target
                                    .value
                                )
                              }
                            />

                          </td>

                          <td className="value-cell">
                            {result.overall.toFixed(
                              2
                            )}
                          </td>

                          <td>

                            <span
                              className={levelClass(
                                result
                                  .level
                                  .level
                              )}
                            >
                              Level{" "}
                              {
                                result
                                  .level
                                  .level
                              }
                            </span>

                          </td>

                          <td
                            className={
                              result.gap >=
                              0
                                ? "gap-positive"
                                : "gap-negative"
                            }
                          >
                            {result.gap >=
                            0
                              ? "+"
                              : ""}

                            {result.gap.toFixed(
                              2
                            )}
                          </td>

                          <td>

                            <span
                              className={
                                result.achieved
                                  ? "status-achieved"
                                  : "status-pending"
                              }
                            >
                              {result.achieved
                                ? "Achieved"
                                : "Not Achieved"}
                            </span>

                          </td>

                        </tr>
                      );
                    }
                  )}

                </tbody>

              </table>

            </div>

            <div className="method-note">

              <strong>
                Methodology note:
              </strong>{" "}

              Direct/Indirect weights and
              target values are editable so
              the institution can use its
              officially approved attainment
              methodology.

            </div>

          </div>

          {/* =================================================
              PO RESULT
          ================================================= */}

          <div className="sub-section">

            <div className="sub-heading">
              7. Overall PO Attainment
              Assessment
            </div>

            {renderAttainmentTable(
              PO_LIST.map(
                (outcome) => ({
                  outcome,
                })
              )
            )}

          </div>

          {/* =================================================
              PSO RESULT
          ================================================= */}

          <div className="sub-section">

            <div className="sub-heading">
              8. Overall PSO Attainment
              Assessment
            </div>

            {renderAttainmentTable(
              PSO_LIST.map(
                (outcome) => ({
                  outcome,
                })
              ),
              true
            )}

          </div>

          {/* =================================================
              SUMMARY
          ================================================= */}

          <div className="sub-section">

            <div className="sub-heading">
              9. Overall Assessment
              Summary
            </div>

            <div className="overall-grid">

              <div className="overall-box">

                <div className="overall-title">
                  Overall PO Attainment
                </div>

                <div className="overall-number">
                  {overallPO.toFixed(
                    2
                  )}
                </div>

                <div
                  className={levelClass(
                    overallPOLevel.level
                  )}
                >
                  Level{" "}
                  {
                    overallPOLevel.level
                  }
                </div>

                <p>
                  {
                    overallPOLevel.label
                  }
                </p>

                <small>
                  {
                    poTargetCount
                  }
                  {" / "}
                  {
                    PO_LIST.length
                  }
                  {" "}
                  POs achieved target
                </small>

              </div>

              <div className="overall-box">

                <div className="overall-title">
                  Overall PSO Attainment
                </div>

                <div className="overall-number">
                  {overallPSO.toFixed(
                    2
                  )}
                </div>

                <div
                  className={levelClass(
                    overallPSOLevel.level
                  )}
                >
                  Level{" "}
                  {
                    overallPSOLevel.level
                  }
                </div>

                <p>
                  {
                    overallPSOLevel.label
                  }
                </p>

                <small>
                  {
                    psoTargetCount
                  }
                  {" / "}
                  {
                    PSO_LIST.length
                  }
                  {" "}
                  PSOs achieved target
                </small>

              </div>

            </div>

          </div>

          {/* =================================================
              DISTRIBUTION
          ================================================= */}

          <div className="sub-section">

            <div className="sub-heading">
              10. PO / PSO Attainment Level
              Distribution
            </div>

            <div className="distribution-grid">

              {levelDistribution.map(
                (item) => (
                  <div
                    className="distribution-item"
                    key={
                      item.level
                    }
                  >

                    <div className="distribution-level">
                      Level{" "}
                      {
                        item.level
                      }
                    </div>

                    <div className="distribution-values">

                      <div>
                        <strong>
                          {
                            item.po
                          }
                        </strong>

                        <small>
                          POs
                        </small>
                      </div>

                      <div>
                        <strong>
                          {
                            item.pso
                          }
                        </strong>

                        <small>
                          PSOs
                        </small>
                      </div>

                    </div>

                  </div>
                )
              )}

            </div>

          </div>

          {/* =================================================
              LEVEL VERIFICATION
          ================================================= */}

          <div className="sub-section">

            <div className="sub-heading">
              11. Mandatory Verification of
              Minimum Two PO and Two PSO
              Attainment Levels
            </div>

            <div className="verification-grid">

              <div className="verify-card">

                <h3>
                  PO Levels Verification
                </h3>

                <p>
                  Select the actual PO attainment
                  levels verified from documentary
                  evidence. No level is pre-selected.
                </p>

                <div className="level-buttons">

                  {[1, 2, 3, 4].map(
                    (level) => (
                      <button
                        type="button"
                        key={
                          level
                        }
                        className={
                          verifiedPOLevels.includes(
                            level
                          )
                            ? "selected-level"
                            : "unselected-level"
                        }
                        onClick={() =>
                          togglePOLevel(
                            level
                          )
                        }
                      >
                        Level{" "}
                        {
                          level
                        }
                      </button>
                    )
                  )}

                </div>

                <div
                  className={
                    verifiedPOLevels.length >=
                    2
                      ? "verification-success"
                      : "verification-warning"
                  }
                >

                  <FaCheckCircle />

                  {verifiedPOLevels.length >=
                  2
                    ? `${verifiedPOLevels.length} PO attainment levels selected`
                    : "Select minimum two PO attainment levels"}

                </div>

              </div>

              <div className="verify-card">

                <h3>
                  PSO Levels Verification
                </h3>

                <p>
                  Select the actual PSO attainment
                  levels verified from documentary
                  evidence. No level is pre-selected.
                </p>

                <div className="level-buttons">

                  {[1, 2, 3, 4].map(
                    (level) => (
                      <button
                        type="button"
                        key={
                          level
                        }
                        className={
                          verifiedPSOLevels.includes(
                            level
                          )
                            ? "selected-level"
                            : "unselected-level"
                        }
                        onClick={() =>
                          togglePSOLevel(
                            level
                          )
                        }
                      >
                        Level{" "}
                        {
                          level
                        }
                      </button>
                    )
                  )}

                </div>

                <div
                  className={
                    verifiedPSOLevels.length >=
                    2
                      ? "verification-success"
                      : "verification-warning"
                  }
                >

                  <FaCheckCircle />

                  {verifiedPSOLevels.length >=
                  2
                    ? `${verifiedPSOLevels.length} PSO attainment levels selected`
                    : "Select minimum two PSO attainment levels"}

                </div>

              </div>

            </div>

          </div>

          {/* =================================================
              NEW: ATTAINMENT ANALYSIS / DECISION MAKING
          ================================================= */}

          <div className="sub-section">

            <div className="sub-heading">
              12. Attainment Analysis,
              Decision Making and Improvement
            </div>

            <div className="table-container">

              <table className="assessment-input-table">

                <thead>

                  <tr>

                    <th>
                      Outcome
                    </th>

                    <th>
                      Target
                    </th>

                    <th>
                      Actual Attainment
                    </th>

                    <th>
                      Gap
                    </th>

                    <th>
                      Decision
                    </th>

                    <th>
                      Action Taken
                    </th>

                    <th>
                      Improvement Required
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {[
                    ...PO_LIST,
                    ...PSO_LIST,
                  ].map(
                    (outcome) => {
                      const result =
                        overallResults[
                          outcome
                        ];

                      const plan =
                        actionPlans[
                          outcome
                        ] || {};

                      return (
                        <tr
                          key={
                            outcome
                          }
                        >

                          <td>
                            <strong>
                              {
                                outcome
                              }
                            </strong>
                          </td>

                          <td>
                            {result.target.toFixed(
                              2
                            )}
                          </td>

                          <td>
                            {result.overall.toFixed(
                              2
                            )}
                          </td>

                          <td
                            className={
                              result.gap >=
                              0
                                ? "gap-positive"
                                : "gap-negative"
                            }
                          >
                            {result.gap >=
                            0
                              ? "+"
                              : ""}

                            {result.gap.toFixed(
                              2
                            )}
                          </td>

                          <td>

                            <select
                              value={
                                plan.decision ||
                                (
                                  result.achieved
                                    ? "Target Achieved"
                                    : "Improvement Required"
                                )
                              }
                              onChange={(
                                e
                              ) =>
                                handleActionPlanChange(
                                  outcome,
                                  "decision",
                                  e
                                    .target
                                    .value
                                )
                              }
                            >

                              <option value="">
                                Select Decision
                              </option>

                              <option value="Target Achieved">
                                Target Achieved
                              </option>

                              <option value="Improvement Required">
                                Improvement Required
                              </option>

                              <option value="Continuous Improvement">
                                Continuous Improvement
                              </option>

                            </select>

                          </td>

                          <td>

                            <textarea
                              rows="3"
                              placeholder="Enter action taken based on attainment analysis"
                              value={
                                plan.actionTaken ||
                                ""
                              }
                              onChange={(
                                e
                              ) =>
                                handleActionPlanChange(
                                  outcome,
                                  "actionTaken",
                                  e
                                    .target
                                    .value
                                )
                              }
                            />

                          </td>

                          <td>

                            <textarea
                              rows="3"
                              placeholder="Enter improvement required / future action"
                              value={
                                plan.improvementRequired ||
                                ""
                              }
                              onChange={(
                                e
                              ) =>
                                handleActionPlanChange(
                                  outcome,
                                  "improvementRequired",
                                  e
                                    .target
                                    .value
                                )
                              }
                            />

                          </td>

                        </tr>
                      );
                    }
                  )}

                </tbody>

              </table>

            </div>

            <div className="method-note">

              <strong>
                Decision-making methodology:
              </strong>{" "}

              Attainment is compared with the
              approved target. Positive gap indicates
              target achievement. Negative gap indicates
              the need for corrective action and
              continuous improvement. The documented
              action and improvement requirement provide
              evidence of analysis and decision making.

            </div>

          </div>

          {/* =================================================
              READINESS
          ================================================= */}

          <div className="final-readiness-card">

            <div>

              <h3>
                3.8 Assessment Readiness
              </h3>

              <p>
                The page checks the required
                Criteria 3.7.2 source data,
                documentary evidence, minimum PO/PSO
                level verification and calculation
                weightage before Save.
              </p>

            </div>

            <div className="readiness-list">

              <span
                className={
                  coreCourseDataComplete
                    ? "ready"
                    : "not-ready"
                }
              >

                <FaCheckCircle />

                Core-course CO1–CO5 data from
                Criteria 3.7.2

              </span>

              <span
                className={
                  weightageValid
                    ? "ready"
                    : "not-ready"
                }
              >

                <FaCheckCircle />

                Weightage = 100%

              </span>

              <span
                className={
                  minimumVerificationComplete
                    ? "ready"
                    : "not-ready"
                }
              >

                <FaCheckCircle />

                2 PO + 2 PSO levels

              </span>

              <span
                className={
                  evidenceVerificationComplete
                    ? "ready"
                    : "not-ready"
                }
              >

                <FaCheckCircle />

                Documentary verification

              </span>

            </div>

          </div>

        </div>

        {/* =================================================
            EXTRA FILE
        ================================================= */}

        <div className="file-card">

          <div className="card-heading">
            Additional Documentary
            Evidence
          </div>

          <div className="upload-area">

            <input
              type="file"
              ref={
                fileInputRef
              }
              onChange={
                handleSelectedFile
              }
              style={{
                display:
                  "none",
              }}
              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png"
            />

            <button
              type="button"
              className="upload-button"
              onClick={
                handleUploadClick
              }
            >
              <FaUpload />
              Choose Document
            </button>

            {selectedFile && (
              <div className="selected-file">

                <div className="file-name">

                  <FaFileAlt />

                  <span>
                    {
                      selectedFile.name
                    }
                  </span>

                </div>

                <div className="file-buttons">

                  <button
                    type="button"
                    className="view-button"
                    onClick={() =>
                      openFile(
                        selectedFile
                      )
                    }
                  >
                    <FaEye />
                    View
                  </button>

                  <button
                    type="button"
                    className="download-button"
                    onClick={() =>
                      downloadFile(
                        selectedFile
                      )
                    }
                  >
                    <FaDownload />
                    Download
                  </button>

                </div>

              </div>
            )}

          </div>

        </div>

        {/* =================================================
            BOTTOM BUTTONS
        ================================================= */}

        <div className="bottom-actions">

          <button
            type="button"
            className="action-button previous-button"
            onClick={() =>
              navigate(
                "/criteria/3.7.2-course-outcome-attainment"
              )
            }
          >
            <FaArrowLeft />
            Previous
          </button>

          <button
            type="button"
            className="action-button back-button"
            onClick={() =>
              navigate("/")
            }
          >
            <FaArrowLeft />
            Back
          </button>

          <button
            type="button"
            className="action-button save-button"
            onClick={
              handleSave
            }
          >
            <FaSave />

            {saved
              ? "Saved"
              : "Save"}
          </button>

          <button
            type="button"
            className="action-button delete-button"
            onClick={
              handleDelete
            }
          >
            <FaTrash />
            Delete
          </button>

          <button
            type="button"
            className="action-button print-button"
            onClick={
              handlePrint
            }
          >
            <FaPrint />
            Print
          </button>

          <button
            type="button"
            className="action-button clear-button"
            onClick={
              handleClear
            }
          >
            <FaBroom />
            Clear
          </button>

          <button
            type="button"
            className="action-button next-button"
            onClick={() =>
              navigate("/")
            }
          >
            Next
            <FaArrowRight />
          </button>

        </div>

        {/* =================================================
            FOOTER
        ================================================= */}

        <div className="page-note">

          <span>
            Criteria 3.8 — Attainment of
            Program Outcomes and Program
            Specific Outcomes
          </span>

          <strong>
            {loadedFrom37_2
              ? "3.7.2 CO1–CO5 Data Connected"
              : "Waiting for Criteria 3.7.2 Data"}
          </strong>

        </div>

      </main>

    </div>
  );
}

export default AttainmentPOPSO;