import { 
  INITIAL_BLOCKS, 
  INITIAL_ROOMS, 
  INITIAL_RESIDENTS, 
  INITIAL_COMPLAINTS, 
  INITIAL_FEES, 
  INITIAL_GATE_PASSES, 
  INITIAL_VISITORS,
  MESS_MENU 
} from './mockData';

const KEYS = {
  BLOCKS: 'hms_blocks_v1',
  ROOMS: 'hms_rooms_v1',
  RESIDENTS: 'hms_residents_v1',
  COMPLAINTS: 'hms_complaints_v1',
  FEES: 'hms_fees_v1',
  GATE_PASSES: 'hms_gate_passes_v1',
  VISITORS: 'hms_visitors_v1',
  MEAL_OPTOUTS: 'hms_meal_optouts_v1',
};

const getStorage = (key, defaultVal) => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultVal;
  } catch (e) {
    console.error('Error reading localStorage key', key, e);
    return defaultVal;
  }
};

const setStorage = (key, val) => {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {
    console.error('Error setting localStorage key', key, e);
  }
};

export const initializeStorage = () => {
  if (!localStorage.getItem(KEYS.BLOCKS)) setStorage(KEYS.BLOCKS, INITIAL_BLOCKS);
  if (!localStorage.getItem(KEYS.ROOMS)) setStorage(KEYS.ROOMS, INITIAL_ROOMS);
  if (!localStorage.getItem(KEYS.RESIDENTS)) setStorage(KEYS.RESIDENTS, INITIAL_RESIDENTS);
  if (!localStorage.getItem(KEYS.COMPLAINTS)) setStorage(KEYS.COMPLAINTS, INITIAL_COMPLAINTS);
  if (!localStorage.getItem(KEYS.FEES)) setStorage(KEYS.FEES, INITIAL_FEES);
  if (!localStorage.getItem(KEYS.GATE_PASSES)) setStorage(KEYS.GATE_PASSES, INITIAL_GATE_PASSES);
  if (!localStorage.getItem(KEYS.VISITORS)) setStorage(KEYS.VISITORS, INITIAL_VISITORS);
};

export const resetStorageToDefaults = () => {
  setStorage(KEYS.BLOCKS, INITIAL_BLOCKS);
  setStorage(KEYS.ROOMS, INITIAL_ROOMS);
  setStorage(KEYS.RESIDENTS, INITIAL_RESIDENTS);
  setStorage(KEYS.COMPLAINTS, INITIAL_COMPLAINTS);
  setStorage(KEYS.FEES, INITIAL_FEES);
  setStorage(KEYS.GATE_PASSES, INITIAL_GATE_PASSES);
  setStorage(KEYS.VISITORS, INITIAL_VISITORS);
  setStorage(KEYS.MEAL_OPTOUTS, []);
};

export const getAppData = () => {
  initializeStorage();
  return {
    blocks: getStorage(KEYS.BLOCKS, INITIAL_BLOCKS),
    rooms: getStorage(KEYS.ROOMS, INITIAL_ROOMS),
    residents: getStorage(KEYS.RESIDENTS, INITIAL_RESIDENTS),
    complaints: getStorage(KEYS.COMPLAINTS, INITIAL_COMPLAINTS),
    fees: getStorage(KEYS.FEES, INITIAL_FEES),
    gatePasses: getStorage(KEYS.GATE_PASSES, INITIAL_GATE_PASSES),
    visitors: getStorage(KEYS.VISITORS, INITIAL_VISITORS),
    mealOptOuts: getStorage(KEYS.MEAL_OPTOUTS, []),
    messMenu: MESS_MENU
  };
};

export const saveAppData = (keyName, data) => {
  const mapKey = KEYS[keyName];
  if (mapKey) {
    setStorage(mapKey, data);
  }
};
