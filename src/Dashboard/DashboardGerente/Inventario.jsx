const Inventario = () => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-4 w-full h-full">
      <h2 className="text-xl font-bold mb-4">Inventario</h2>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b-2 border-gray-300 text-left leading-tight">ID</th>
            <th className="py-2 px-4 border-b-2 border-gray-300 text-left leading-tight">Material</th>
            <th className="py-2 px-4 border-b-2 border-gray-300 text-left leading-tight">Cantidad</th>
            <th className="py-2 px-4 border-b-2 border-gray-300 text-left leading-tight">Descripción</th>
          </tr>
        </thead>
        <tbody>
          {/* Aquí se agregarán las filas con los datos del inventario */}
        </tbody>
      </table>
    </div>
  );
};

export default Inventario;
