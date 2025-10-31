let recyclingRecords = [];

export const RecyclingModel = {
  getAll: () => recyclingRecords,

  findById: (id) => {
    return recyclingRecords.find(record => record.id === Number(id));
  },

  create: (tipo, cantidad) => {
    const newRecord = {
      id: Date.now(),
      tipo,
      cantidad: Number(cantidad)
    };
    recyclingRecords.push(newRecord);
    return newRecord;
  },

  delete: (id) => {
    const record = recyclingRecords.find(record => record.id === Number(id));
    if (!record) return false;
    
    recyclingRecords = recyclingRecords.filter(record => record.id !== Number(id));
    return true;
  }
};
