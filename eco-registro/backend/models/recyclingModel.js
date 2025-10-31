let recyclingRecords = [];

export const RecyclingModel = {
  getAll: () => recyclingRecords,

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
    recyclingRecords = recyclingRecords.filter(record => record.id !== Number(id));
  }
};
