import sql from '../app/lib/data'; // Ajusta la ruta según tu organización

(async () => {
  try {
    const result = await sql`SELECT 1 + 1 AS result`;
    console.log('Conexión exitosa:', result.rows);
  } catch (error) {
    console.error('Error al conectar con la base de datos:', error);
  }
})();
