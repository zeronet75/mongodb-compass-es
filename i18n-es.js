(function () {
  'use strict';

  // Capa de traduccion al espanol para MongoDB Compass.
  // Traduce nodos de texto y atributos visibles en tiempo de ejecucion.
  var DICT = {
  "Add": "Añadir",
  "Add data": "Añadir datos",
  "Add new connection": "Añadir nueva conexión",
  "Add rule": "Añadir regla",
  "Add stage": "Añadir etapa",
  "Adds UI for auto-embedded vector search indexes": "Añade interfaz para índices de búsqueda vectorial autoincrustados",
  "Adds UI for auto-embedded vector search indexes (private preview)": "Añade interfaz para índices de búsqueda vectorial autoincrustados (vista previa privada)",
  "Add additional MongoDB URI options to customize your connection.": "Añade opciones adicionales a la URI de MongoDB para personalizar tu conexión.",
  "Advanced": "Avanzado",
  "Advanced Connection Options": "Opciones de conexión avanzadas",
  "Advanced Options Tabs": "Pestañas de opciones avanzadas",
  "aggregation": "agregación",
  "Aggregation": "Agregación",
  "Aggregations": "Agregaciones",
  "All queries executed from the query bar will apply this sort.": "Todas las consultas ejecutadas desde la barra de consultas aplicarán este orden.",
  "Allow interaction with MongoDB deployments via the embedded shell.": "Permitir la interacción con implementaciones de MongoDB mediante el shell integrado.",
  "Allow the MongoDB Assistant to interact with your databases. All actions require your approval before running. Learn more about": "Permitir que el Asistente de MongoDB interactúe con tus bases de datos. Todas las acciones requieren tu aprobación antes de ejecutarse. Más información sobre",
  "Allow the use of AI features which make requests to 3rd party services.": "Permitir el uso de funciones de IA que realizan solicitudes a servicios de terceros.",
  "Analyze": "Analizar",
  "Analyze schema": "Analizar esquema",
  "and": "y",
  "Application-level Proxy": "Proxy a nivel de aplicación",
  "Apply": "Aplicar",
  "Artificial Intelligence": "Inteligencia artificial",
  "Authentication": "Autenticación",
  "Authentication Database": "Base de datos de autenticación",
  "Authentication Database Documentation": "Documentación de la base de datos de autenticación",
  "Authentication database used when authSource is not specified.": "Base de datos de autenticación utilizada cuando no se especifica authSource.",
  "Authentication Mechanism": "Mecanismo de autenticación",
  "Authentication Method": "Método de autenticación",
  "Automatically switch between light and dark themes based on your OS settings": "Cambiar automáticamente entre temas claro y oscuro según la configuración del sistema operativo",
  "Avg. document size": "Tamaño medio de documento",
  "Avg. rate of usage": "Tasa media de uso",
  "AWS IAM": "AWS IAM",
  "Back": "Atrás",
  "Browser command to use for authentication": "Comando del navegador que se usará para la autenticación",
  "Bulk": "Masivo",
  "Cancel": "Cancelar",
  "Certificate Authority (.pem)": "Entidad de certificación (.pem)",
  "Change the appearance of the application.": "Cambia la apariencia de la aplicación.",
  "Change the behavior of the OIDC authentication mechanism for server connection and Atlas Login.": "Cambia el comportamiento del mecanismo de autenticación OIDC para la conexión al servidor y el inicio de sesión en Atlas.",
  "Choose which members your reads go to.": "Elige a qué miembros se dirigen tus lecturas.",
  "Client Certificate and Key (.pem)": "Certificado y clave de cliente (.pem)",
  "Client Key Password": "Contraseña de la clave de cliente",
  "Clone": "Clonar",
  "Close": "Cerrar",
  "Close AI Helper": "Cerrar el asistente de IA",
  "Close modal": "Cerrar ventana",
  "Close Tab": "Cerrar pestaña",
  "Code": "Código",
  "Collapse": "Contraer",
  "Collapse all connections": "Contraer todas las conexiones",
  "Collection": "Colección",
  "Collection name": "Nombre de la colección",
  "Color": "Color",
  "Compass": "Compass",
  "Confirm": "Confirmar",
  "Connect": "Conectar",
  "Connected to": "Conectado a",
  "Connection": "Conexión",
  "Connection String Documentation": "Documentación de la cadena de conexión",
  "Connection String Scheme": "Esquema de la cadena de conexión",
  "Connections": "Conexiones",
  "Continue": "Continuar",
  "Copy": "Copiar",
  "Create": "Crear",
  "Create collection": "Crear colección",
  "Create database": "Crear base de datos",
  "Create Index": "Crear índice",
  "Create new": "Crear nuevo",
  "Create new tab": "Crear pestaña",
  "Create validation rules": "Crear reglas de validación",
  "Dark Theme": "Tema oscuro",
  "Data": "Datos",
  "Data Modeling": "Modelado de datos",
  "Data size": "Tamaño de los datos",
  "Database": "Base de datos",
  "Databases": "Bases de datos",
  "Databases and Collections": "Bases de datos y colecciones",
  "Default": "Predeterminado",
  "Default Authentication Database": "Base de datos de autenticación predeterminada",
  "Default Sort for Query Bar": "Orden predeterminado de la barra de consultas",
  "Delete": "Eliminar",
  "Details": "Detalles",
  "Direct Connection": "Conexión directa",
  "Disable": "Desactivar",
  "Disable the validation of the hostnames in the certificate presented by the mongod/mongos instance.": "Desactiva la validación de los nombres de host en el certificado presentado por la instancia de mongod/mongos.",
  "Disable the validation of the server certificates.": "Desactiva la validación de los certificados del servidor.",
  "Disabled": "Desactivado",
  "Document": "Documento",
  "Document list": "Lista de documentos",
  "Documents": "Documentos",
  "Done": "Hecho",
  "Download": "Descargar",
  "Drop": "Eliminar",
  "Drop database": "Eliminar base de datos",
  "Duplicate": "Duplicar",
  "Edit": "Editar",
  "Edit Connection": "Editar conexión",
  "Edit Connection String": "Editar cadena de conexión",
  "Enable": "Activar",
  "Enable AI Features": "Activar funciones de IA",
  "Enable auto-embedding lexical prefilter syntax in search index editor": "Activar la sintaxis de prefiltro léxico de autoincrustación en el editor de índices de búsqueda",
  "Enable DevTools": "Activar DevTools",
  "Enable MongoDB Shell": "Activar MongoDB Shell",
  "Enable read-only tools in the MongoDB Assistant": "Activar herramientas de solo lectura en el Asistente de MongoDB",
  "Enable sending sample field values with query and aggregation generation requests.": "Activar el envío de valores de campo de muestra con las solicitudes de generación de consultas y agregaciones.",
  "Enable sorted syntax for search indexes schema": "Activar la sintaxis ordenada para el esquema de índices de búsqueda",
  "Enable the Chromium Developer Tools that can be used to debug Electron's process.": "Activar las Herramientas para desarrolladores de Chromium que se pueden usar para depurar el proceso de Electron.",
  "Enable the GA release of auto-embedded vector search indexes": "Activar la versión GA de los índices de búsqueda vectorial autoincrustados",
  "Enable VectorX support for vector search indexes (private preview)": "Activar la compatibilidad con VectorX para índices de búsqueda vectorial (vista previa privada)",
  "Enabled": "Activado",
  "Encoding for Displaying Legacy UUID Values": "Codificación para mostrar valores UUID heredados",
  "Enter a plain text query that the AI will translate into MongoDB query language.": "Escribe una consulta en texto plano que la IA traducirá al lenguaje de consultas de MongoDB.",
  "Expand all": "Expandir todo",
  "Expand row": "Expandir fila",
  "Explain": "Explicar",
  "Explain aggregation": "Explicar agregación",
  "Explain Plan": "Plan de ejecución",
  "Explain query": "Explicar consulta",
  "Export": "Exportar",
  "Export Code": "Exportar código",
  "Export Data": "Exportar datos",
  "Export pipeline results": "Exportar resultados de la canalización",
  "Export query results": "Exportar resultados de la consulta",
  "Export query to language": "Exportar consulta a un lenguaje",
  "Export the full collection": "Exportar la colección completa",
  "Favorite this connection": "Marcar esta conexión como favorita",
  "Favoriting a connection will pin it to the top of your list of connections": "Marcar una conexión como favorita la fija en la parte superior de la lista de conexiones",
  "Feature Preview": "Vista previa de funciones",
  "Feedback": "Comentarios",
  "Field": "Campo",
  "Fields": "Campos",
  "Fewer Options": "Menos opciones",
  "Filter": "Filtrar",
  "Filter connections": "Filtrar conexiones",
  "Find": "Buscar",
  "Finish": "Finalizar",
  "Fold code block": "Contraer bloque de código",
  "folded code": "código contraído",
  "General": "General",
  "Generate": "Generar",
  "Generate aggregation": "Generar agregación",
  "Generate mock data script": "Generar script de datos de prueba",
  "Generate rules": "Generar reglas",
  "Generate rules via schema analysis from existing sample data or add them manually to enforce document structure during updates and inserts": "Genera reglas mediante el análisis del esquema a partir de los datos de muestra existentes o añádelas manualmente para exigir una estructura de documento durante las actualizaciones e inserciones",
  "Hide": "Ocultar",
  "Hide credentials in connection strings from users.": "Ocultar las credenciales de las cadenas de conexión a los usuarios.",
  "Host": "Host",
  "How do I find my connection string in Atlas?": "¿Cómo encuentro mi cadena de conexión en Atlas?",
  "How do I format my connection string?": "¿Cómo doy formato a mi cadena de conexión?",
  "If you don't already have a cluster, you can create one for free using": "Si aún no tienes un clúster, puedes crear uno gratis usando",
  "If you have an Atlas cluster, go to the Cluster view. Click the 'Connect' button for the cluster to which you wish to connect.": "Si tienes un clúster de Atlas, ve a la vista de clústeres. Haz clic en el botón 'Conectar' del clúster al que deseas conectarte.",
  "Import": "Importar",
  "Import JSON or CSV file": "Importar archivo JSON o CSV",
  "in the collection": "en la colección",
  "In-Use Encryption": "Cifrado en uso",
  "Index": "Índice",
  "Index Hint": "Sugerencia de índice",
  "Indexes": "Índices",
  "IndexStats are based off only the currently connected node": "Las estadísticas de índices se basan solo en el nodo conectado actualmente",
  "Infer additional namespaces from privileges": "Inferir espacios de nombres adicionales a partir de los privilegios",
  "Insert": "Insertar",
  "Insert document": "Insertar documento",
  "Install as URL Protocol Handler": "Instalar como controlador del protocolo URL",
  "Kerberos": "Kerberos",
  "Keyboard Shortcuts": "Atajos de teclado",
  "LDAP": "LDAP",
  "Learn More": "Más información",
  "Learn more": "Más información",
  "Learn more about aggregation pipeline stages": "Más información sobre las etapas de la canalización de agregación",
  "Learn more about schema analysis": "Más información sobre el análisis de esquemas",
  "Learn more about validations": "Más información sobre las validaciones",
  "Light Theme": "Tema claro",
  "Limit": "Límite",
  "Limit the application strictly to read operations, with all write and delete capabilities removed.": "Limita la aplicación estrictamente a operaciones de lectura, eliminando todas las capacidades de escritura y eliminación.",
  "Loading": "Cargando",
  "Make the embedded shell follow the current theme instead of always using dark mode.": "Hacer que el shell integrado siga el tema actual en lugar de usar siempre el modo oscuro.",
  "Manage your connection settings": "Administra la configuración de tu conexión",
  "Max Time MS": "Tiempo máximo (ms)",
  "MongoDB Assistant": "Asistente de MongoDB",
  "MongoDB Atlas": "MongoDB Atlas",
  "MongoDB database tools": "Herramientas de base de datos de MongoDB",
  "MongoDB server default": "Valor predeterminado del servidor MongoDB",
  "MongoDB server OIDC Authentication options": "Opciones de autenticación OIDC del servidor MongoDB",
  "More Options": "Más opciones",
  "More Settings": "Más ajustes",
  "My Queries": "Mis consultas",
  "Name": "Nombre",
  "Name & Definition": "Nombre y definición",
  "Nearest": "Más cercano",
  "New Connection": "Nueva conexión",
  "New to Compass and don't have a cluster?": "¿Eres nuevo en Compass y no tienes un clúster?",
  "Next": "Siguiente",
  "Next Page": "Página siguiente",
  "No": "No",
  "No Color": "Sin color",
  "No results": "Sin resultados",
  "None": "Ninguno",
  "Not available for views and timeseries.": "No disponible para vistas y series temporales.",
  "Off": "Desactivado",
  "OK": "Aceptar",
  "On": "Activado",
  "Open": "Abrir",
  "Open MongoDB shell": "Abrir el shell de MongoDB",
  "Open query history": "Abrir el historial de consultas",
  "Open saved pipelines": "Abrir canalizaciones guardadas",
  "Optional": "Opcional",
  "Optional (required with X.509 auth)": "Opcional (obligatorio con autenticación X.509)",
  "Options": "Opciones",
  "Output Options": "Opciones de salida",
  "Password": "Contraseña",
  "Personal timezone display preference": "Preferencia de zona horaria personal",
  "Pin": "Fijar",
  "Pipeline": "Canalización",
  "Preview": "Vista previa",
  "Preview of documents": "Vista previa de documentos",
  "Previous Page": "Página anterior",
  "Primary": "Primario",
  "Primary Preferred": "Primario preferido",
  "Privacy": "Privacidad",
  "Project": "Proyectar",
  "Properties": "Propiedades",
  "Protect Connection String Secrets": "Proteger los secretos de la cadena de conexión",
  "Provides access to advanced generative AI capabilities.": "Proporciona acceso a capacidades avanzadas de IA generativa.",
  "Proxy Configuration": "Configuración del proxy",
  "Proxy/SSH": "Proxy/SSH",
  "Query": "Consulta",
  "Query History": "Historial de consultas",
  "Quickly visualize your schema to understand the frequency, types and ranges of fields in your data set.": "Visualiza rápidamente tu esquema para comprender la frecuencia, los tipos y los rangos de los campos de tu conjunto de datos.",
  "Raw data (no encoding)": "Datos sin procesar (sin codificación)",
  "Read Preference": "Preferencia de lectura",
  "Ready": "Listo",
  "Refresh": "Actualizar",
  "Refresh databases": "Actualizar bases de datos",
  "Refresh documents": "Actualizar documentos",
  "Refresh Indexes": "Actualizar índices",
  "Release Notes": "Notas de la versión",
  "Reload": "Recargar",
  "Remain logged in when using the MONGODB-OIDC authentication mechanism for MongoDB server connection. Access tokens are encrypted using the system keychain before being stored. Disabling this option will remove currently stored tokens.": "Mantener la sesión iniciada al usar el mecanismo de autenticación MONGODB-OIDC para la conexión al servidor MongoDB. Los tokens de acceso se cifran con el llavero del sistema antes de almacenarse. Desactivar esta opción eliminará los tokens almacenados actualmente.",
  "Remove": "Quitar",
  "Rename": "Cambiar nombre",
  "Replica Set Name": "Nombre del conjunto de réplicas",
  "Reset": "Restablecer",
  "Reset query": "Restablecer consulta",
  "Retry": "Reintentar",
  "Reveal namespaces reserved for internal server or Atlas use. Modifications to these namespaces could lead to unknown issues.": "Mostrar los espacios de nombres reservados para uso interno del servidor o de Atlas. Las modificaciones en estos espacios de nombres podrían provocar problemas desconocidos.",
  "Run": "Ejecutar",
  "Run aggregation": "Ejecutar agregación",
  "Save": "Guardar",
  "Save & Connect": "Guardar y conectar",
  "Saved Pipelines": "Canalizaciones guardadas",
  "Schema": "Esquema",
  "Search": "Buscar",
  "Search connections": "Buscar conexiones",
  "Search Indexes": "Índices de búsqueda",
  "Secondary": "Secundario",
  "Secondary Preferred": "Secundario preferido",
  "See example": "Ver ejemplo",
  "Select": "Seleccionar",
  "Select All": "Seleccionar todo",
  "Select a file": "Seleccionar un archivo",
  "Select a file.": "Selecciona un archivo.",
  "Select key": "Seleccionar clave",
  "Set Read-Only Mode": "Establecer modo de solo lectura",
  "Settings": "Ajustes",
  "Show": "Mostrar",
  "Show a checkbox on the connection form to enable device auth flow authentication for MongoDB server OIDC Authentication. This enables a less secure authentication flow that can be used as a fallback when browser-based authentication is unavailable.": "Mostrar una casilla en el formulario de conexión para habilitar la autenticación mediante flujo de dispositivo para la autenticación OIDC del servidor MongoDB. Esto habilita un flujo de autenticación menos seguro que se puede usar como alternativa cuando la autenticación basada en el navegador no está disponible.",
  "Show a password field for Kerberos authentication. Typically only useful when attempting to authenticate as another user than the current system user.": "Mostrar un campo de contraseña para la autenticación Kerberos. Normalmente solo es útil cuando se intenta autenticar como un usuario distinto del usuario actual del sistema.",
  "Show actions": "Mostrar acciones",
  "Show Database and Collection Statistics": "Mostrar estadísticas de bases de datos y colecciones",
  "Show databases and collections implied by your roles and privileges, in addition to those returned by listDatabases and listCollections. This may include namespaces that don't exist yet.": "Mostrar las bases de datos y colecciones implícitas en tus roles y privilegios, además de las devueltas por listDatabases y listCollections. Esto puede incluir espacios de nombres que aún no existen.",
  "Show Device Auth Flow Checkbox": "Mostrar casilla de flujo de autenticación por dispositivo",
  "Show Hidden Namespaces": "Mostrar espacios de nombres ocultos",
  "Show Kerberos Password Field": "Mostrar campo de contraseña de Kerberos",
  "Show Quit Confirmation Dialog": "Mostrar diálogo de confirmación al salir",
  "Size": "Tamaño",
  "Skip": "Omitir",
  "SOCKS5": "SOCKS5",
  "Socks5": "Socks5",
  "Sort": "Ordenar",
  "Sort by Avg. document size": "Ordenar por tamaño medio de documento",
  "Sort by Avg. rate of usage": "Ordenar por tasa media de uso",
  "Sort by Collection name": "Ordenar por nombre de colección",
  "Sort by Data size": "Ordenar por tamaño de los datos",
  "Sort by Documents": "Ordenar por documentos",
  "Sort by Indexes": "Ordenar por índices",
  "Sort by Name & Definition": "Ordenar por nombre y definición",
  "Sort by Properties": "Ordenar por propiedades",
  "Sort by Size": "Ordenar por tamaño",
  "Sort by Status": "Ordenar por estado",
  "Sort by Storage size": "Ordenar por tamaño de almacenamiento",
  "Sort by Total index size": "Ordenar por tamaño total de índices",
  "Sort by Type": "Ordenar por tipo",
  "Sort by Usage": "Ordenar por uso",
  "Specifies whether to force dispatch all operations to the specified host.": "Especifica si se deben enviar todas las operaciones al host especificado.",
  "Specify a shell command that is run to start the browser for authenticating with the OIDC identity provider for the server connection or when logging in to your Atlas Cloud account. Leave this empty for default browser.": "Especifica un comando de shell que se ejecuta para iniciar el navegador para autenticarse con el proveedor de identidad OIDC para la conexión al servidor o al iniciar sesión en tu cuenta de Atlas Cloud. Déjalo vacío para usar el navegador predeterminado.",
  "SSH Tunnel/Proxy Method": "Método de túnel/proxy SSH",
  "SSH with Identity File": "SSH con archivo de identidad",
  "SSH with Password": "SSH con contraseña",
  "SSL/TLS Connection": "Conexión SSL/TLS",
  "Stages": "Etapas",
  "Standard Connection String Format. The standard format of the MongoDB connection URI is used to connect to a MongoDB deployment: standalone, replica set, or a sharded cluster.": "Formato estándar de cadena de conexión. Se usa el formato estándar de la URI de conexión de MongoDB para conectarse a una implementación de MongoDB: independiente, conjunto de réplicas o clúster fragmentado.",
  "Stay logged in with OIDC": "Mantener la sesión iniciada con OIDC",
  "Storage size": "Tamaño de almacenamiento",
  "Supplying sample field values improves the results from the AI.": "Proporcionar valores de campo de muestra mejora los resultados de la IA.",
  "Support": "Soporte",
  "Sync with OS": "Sincronizar con el sistema operativo",
  "Table View": "Vista de tabla",
  "Tell us what to find (e.g. movies from 2000) or paste a query in another language (SQL, Java, etc.)": "Dinos qué buscar (p. ej., películas de 2000) o pega una consulta en otro lenguaje (SQL, Java, etc.)",
  "Text": "Texto",
  "The data will still always be stored in UTC.": "Los datos siempre se almacenarán en UTC.",
  "Theme": "Tema",
  "These settings control experimental behavior of the application. Use them at your own risk!": "Estos ajustes controlan el comportamiento experimental de la aplicación. ¡Úsalos bajo tu responsabilidad!",
  "This includes tlsAllowInvalidHostnames and tlsAllowInvalidCertificates.": "Esto incluye tlsAllowInvalidHostnames y tlsAllowInvalidCertificates.",
  "TLS/SSL": "TLS/SSL",
  "TLS/SSL Option Documentation": "Documentación de opciones TLS/SSL",
  "To enhance the user experience, you can enable or disable particular features. Please choose from the settings below:": "Para mejorar la experiencia de usuario, puedes activar o desactivar funciones concretas. Elige entre los ajustes siguientes:",
  "To get started, connect to an existing server or": "Para empezar, conéctate a un servidor existente o",
  "To pick up a draggable item, press the space bar. While dragging, use the arrow keys to move the item. Press space again to drop the item in its new position, or press escape to cancel.": "Para mover un elemento arrastrable, pulsa la barra espaciadora. Mientras lo arrastras, usa las teclas de flecha para moverlo. Pulsa de nuevo la barra espaciadora para soltarlo en su nueva posición o pulsa Escape para cancelar.",
  "Toggle Auto Preview": "Alternar vista previa automática",
  "Toggle Stage Wizard": "Alternar asistente de etapas",
  "Toggle whether confirmation dialog is shown when quitting (cmd/ctrl-Q).": "Alternar si se muestra el diálogo de confirmación al salir (cmd/ctrl-Q).",
  "Total index size": "Tamaño total de índices",
  "Try again": "Intentar de nuevo",
  "Type": "Tipo",
  "Type a query: { field: 'value' }": "Escribe una consulta: { campo: 'valor' }",
  "Undo": "Deshacer",
  "Redo": "Rehacer",
  "Unfold code block": "Expandir bloque de código",
  "unfold": "expandir",
  "Unpin": "Desfijar",
  "Unsorted": "Sin ordenar",
  "Untitled": "Sin título",
  "Update": "Actualizar",
  "Update number of documents per page, 25": "Cambiar el número de documentos por página, 25",
  "Upper Limit for maxTimeMS for Database Operations": "Límite superior de maxTimeMS para operaciones de base de datos",
  "Upload": "Subir",
  "URI": "URI",
  "URI Options": "Opciones de URI",
  "Usage": "Uso",
  "Use Current Theme in MongoDB Shell": "Usar el tema actual en MongoDB Shell",
  "Username": "Nombre de usuario",
  "Username/Password": "Usuario/Contraseña",
  "Validation": "Validación",
  "Value": "Valor",
  "View": "Ver",
  "View the execution plan for the current query": "Ver el plan de ejecución de la consulta actual",
  "Viewing": "Viendo",
  "Warning": "Advertencia",
  "Welcome": "Bienvenido",
  "Welcome to MongoDB Compass": "Bienvenido a MongoDB Compass",
  "When enabled, the": "Cuando está activado, el",
  "Width of the sidebar, resize using arrow keys": "Ancho de la barra lateral; cambia el tamaño con las teclas de flecha",
  "Wizard": "Asistente",
  "Workspace Tabs": "Pestañas del espacio de trabajo",
  "X.509": "X.509",
  "Yes": "Sí",
  "You are already on the indexes page": "Ya estás en la página de índices",
  "Your pipeline is currently empty.": "Tu canalización está vacía actualmente.",
  "min": "min",
  "of": "de",
  "CREATE FREE CLUSTER": "CREAR CLÚSTER GRATIS",
  "Create free cluster": "Crear clúster gratis",
  "New connection": "Nueva conexión",
  "new connection": "nueva conexión",
  "Connection settings": "Configuración de la conexión",
  "Copy connection string": "Copiar cadena de conexión",
  "Edit connection": "Editar conexión",
  "Duplicate connection": "Duplicar conexión",
  "Remove connection": "Eliminar conexión",
  "Import connections": "Importar conexiones",
  "Export connections": "Exportar conexiones",
  "Open in new tab": "Abrir en una pestaña nueva",
  "Rename collection": "Cambiar nombre de la colección",
  "Rename database": "Cambiar nombre de la base de datos",
  "Delete collection": "Eliminar colección",
  "Drop collection": "Eliminar colección",
  "Close drawer": "Cerrar panel",
  "Collection Tabs": "Pestañas de colección",
  "E-JSON View": "Vista E-JSON",
  "Register as a handler for mongodb:// and mongodb+srv:// URLs": "Registrar como controlador de las URL mongodb:// y mongodb+srv://",
  "Select the encoding to be used when displaying legacy UUID of the binary subtype 3.": "Selecciona la codificación que se usará al mostrar UUID heredados del subtipo binario 3.",
  "commands are occasionally called to access storage statistics for a given database or collection. Disabling this setting can help reduce the overhead on your MongoDB deployments.": "se llaman ocasionalmente para acceder a estadísticas de almacenamiento de una base de datos o colección. Desactivar este ajuste puede ayudar a reducir la sobrecarga en tus implementaciones de MongoDB.",
  "Allow making requests to a 3rd party mapping service.": "Permitir realizar solicitudes a un servicio de mapas de terceros.",
  "Allow periodically checking for new updates.": "Permitir comprobar periódicamente si hay actualizaciones.",
  "Allow sending anonymous usage statistics.": "Permitir el envío de estadísticas de uso anónimas.",
  "Enable Automatic Updates": "Activar actualizaciones automáticas",
  "Enable Geographic Visualizations": "Activar visualizaciones geográficas",
  "Enable Usage Statistics": "Activar estadísticas de uso",
  "Enables a tool that our Product team can use to occasionally reach out for feedback.": "Activa una herramienta que nuestro equipo de producto puede usar para solicitar comentarios ocasionalmente.",
  "Give Product Feedback": "Enviar comentarios sobre el producto",
  "Learn more:": "Más información:",
  "MongoDB Privacy Policy": "Política de privacidad de MongoDB",
  "To enhance the user experience, you can enable integration with 3rd party services, which requires external network requests. Please choose from the settings below:": "Para mejorar la experiencia de usuario, puedes activar la integración con servicios de terceros, lo que requiere solicitudes de red externas. Elige entre los ajustes siguientes:",
  "With any of these options, none of your personal information or stored data will be submitted.": "Con cualquiera de estas opciones, no se enviará tu información personal ni tus datos almacenados.",
  "Comma-separated list of hostnames and IP addresses. Connections to these hosts will not be forwarded through the proxy.": "Lista de nombres de host y direcciones IP separados por comas. Las conexiones a estos hosts no se reenviarán a través del proxy.",
  "Excluded hosts": "Hosts excluidos",
  "Manual Configuration": "Configuración manual",
  "No Proxy": "Sin proxy",
  "System Proxy": "Proxy del sistema",
  "Create Database": "Crear base de datos",
  "Create Collection": "Crear colección",
  "Database Name": "Nombre de la base de datos",
  "Collection Name": "Nombre de la colección",
  "This action is irreversible.": "Esta acción es irreversible.",
  "I understand": "Entiendo",
  "Enter new name": "Introduce el nuevo nombre",
  "Drop Collection": "Eliminar colección",
  "Drop Database": "Eliminar base de datos",
  "Are you sure you want to drop this database?": "¿Seguro que quieres eliminar esta base de datos?",
  "Are you sure you want to drop this collection?": "¿Seguro que quieres eliminar esta colección?",
  "Insert Document": "Insertar documento",
  "Update Document": "Actualizar documento",
  "Delete Document": "Eliminar documento",
  "Clone Document": "Clonar documento",
  "Copy Document": "Copiar documento",
  "View Document": "Ver documento",
  "Edit Document": "Editar documento",
  "Add Field": "Añadir campo",
  "Add field": "Añadir campo",
  "Add field after": "Añadir campo después",
  "Add field before": "Añadir campo antes",
  "Remove field": "Quitar campo",
  "Collapse all": "Contraer todo",
  "Editor": "Editor",
  "Format": "Formato",
  "Format document": "Formatear documento",
  "Recent": "Recientes",
  "Favorites": "Favoritos",
  "Save query": "Guardar consulta",
  "Save Pipeline": "Guardar canalización",
  "Pipeline name": "Nombre de la canalización",
  "Stage": "Etapa",
  "Select a stage": "Selecciona una etapa",
  "Select Fields": "Seleccionar campos",
  "Select Fields with a projection": "Seleccionar campos con una proyección",
  "Export Full Collection": "Exportar colección completa",
  "Export Query Results": "Exportar resultados de la consulta",
  "Export Format": "Formato de exportación",
  "File Name": "Nombre del archivo",
  "Output": "Salida",
  "Include field names in the first row": "Incluir nombres de campos en la primera fila",
  "Exporting...": "Exportando...",
  "MongoDB Shell": "Shell de MongoDB",
  "Clear": "Limpiar",
  "Shell": "Shell",
  "Saved queries": "Consultas guardadas",
  "Recent queries": "Consultas recientes",
  "Diagram": "Diagrama",
  "New diagram": "Nuevo diagrama",
  "Add diagram": "Añadir diagrama",
  "Copy to clipboard": "Copiar al portapapeles",
  "Copied": "Copiado",
  "Copied to clipboard": "Copiado al portapapeles",
  "Something went wrong": "Algo salió mal",
  "No documents": "No hay documentos",
  "No results found": "No se encontraron resultados",
  "Discard": "Descartar",
  "Changes saved": "Cambios guardados",
  "Saving...": "Guardando...",
  "Connection failed": "Error de conexión",
  "Invalid connection string": "Cadena de conexión no válida",
  "Show more": "Mostrar más",
  "Show less": "Mostrar menos",
  "Connection String": "Cadena de conexión",
  "Choose a color": "Elige un color",
  "Projection": "Proyección",
  "Collation": "Intercalación",
  "Count": "Recuento",
  "Sample": "Muestra",
  "Required": "Obligatorio",
  "Optional ": "Opcional ",
  "Default value": "Valor predeterminado",
  "Description": "Descripción",
  "Create index": "Crear índice",
  "Index name": "Nombre del índice",
  "Index fields": "Campos del índice",
  "Build index": "Crear índice",
  "Drop index": "Eliminar índice",
  "Hide index": "Ocultar índice",
  "Unhide index": "Mostrar índice",
  "This action cannot be undone.": "Esta acción no se puede deshacer.",
  "Add validation rule": "Añadir regla de validación",
  "Validation rules": "Reglas de validación",
  "JSON Schema": "Esquema JSON",
  "Rule name": "Nombre de la regla",
  "Severity": "Gravedad",
  "Error": "Error",
  "Resample": "Volver a muestrear",
  "Sampling": "Muestreo",
  "Sampled documents": "Documentos muestreados",
  "Schema analysis": "Análisis de esquema",
  "Field type": "Tipo de campo",
  "Value distribution": "Distribución de valores",
  "Collapsible": "Contraíble",
  "Expand": "Expandir",
  "Explore your schema": "Explorar tu esquema",
  "Select a file...": "Seleccionar un archivo...",
  "Learn more about": "Más información sobre",
  "Show password": "Mostrar contraseña",
  "Hide password": "Ocultar contraseña",
  "Enter a name for this connection": "Introduce un nombre para esta conexión",
  "Additional options": "Opciones adicionales",
  "Advanced options": "Opciones avanzadas",
  "Close Message": "Cerrar mensaje",
  "Status": "Estado",
  "URL Option Value": "Valor de la opción de URL",
  "Select a file…": "Seleccionar un archivo…",
  "Need help getting started?": "¿Necesitas ayuda para empezar?",
  "success notification": "notificación de éxito",
  "Time-Series": "Series temporales",
  "Time-series collections efficiently store sequences of measurements over a period of time.": "Las colecciones de series temporales almacenan de forma eficiente secuencias de mediciones a lo largo del tiempo.",
  "Additional preferences": "Preferencias adicionales",
  "(e.g. Custom collation, Clustered collections)": "(p. ej., intercalación personalizada, colecciones agrupadas)",
  "Custom collation": "Intercalación personalizada",
  "Clustered collections": "Colecciones agrupadas",
  "Time series": "Series temporales",
  "Clustered": "Agrupada",
  "VIEW": "VER",
  "Stop": "Detener",
  "History": "Historial",
  "Snippets": "Fragmentos",
  "Load": "Cargar",
  "Search queries": "Buscar consultas",
  "Delete query": "Eliminar consulta",
  "Open query": "Abrir consulta",
  "Sample size": "Tamaño de la muestra",
  "Relationships": "Relaciones",
  "Documentation": "Documentación",
  "API": "API",
  "Close tab": "Cerrar pestaña",
  "Show all": "Mostrar todo",
  "Hide all": "Ocultar todo",
  "To collection": "A la colección",
  "Export Options": "Opciones de exportación",
  "Choose a file name and location": "Elige un nombre de archivo y una ubicación",
  "Full Collection": "Colección completa",
  "Query Results": "Resultados de la consulta",
  "Selected Fields": "Campos seleccionados",
  "Go to": "Ir a",
  "Next document": "Documento siguiente",
  "Previous document": "Documento anterior",
  "see more connection options": "ver más opciones de conexión",
  "See more connection options": "Ver más opciones de conexión"
};

  var RULES = [
  [
    "^Compass (.+) installed successfully$",
    "",
    "Compass $1 instalado correctamente"
  ],
  [
    "^Connected to (.+)$",
    "",
    "Conectado a $1"
  ],
  [
    "^Connecting to (.+)$",
    "",
    "Conectando a $1"
  ],
  [
    "^Delete (.+)$",
    "",
    "Eliminar $1"
  ],
  [
    "^Drop (.+)$",
    "",
    "Eliminar $1"
  ],
  [
    "^Clone (.+)$",
    "",
    "Clonar $1"
  ],
  [
    "^Create (collection|database|index) (.+)$",
    "",
    "Crear $1 $2"
  ],
  [
    "^(\\d[\\d.,]*)\\s+documents?$",
    "",
    "$1 documentos"
  ],
  [
    "^(\\d[\\d.,]*)\\s+collections?$",
    "",
    "$1 colecciones"
  ],
  [
    "^(\\d[\\d.,]*)\\s+indexes$",
    "",
    "$1 índices"
  ],
  [
    "^(\\d[\\d.,]*)\\s+of\\s+(\\d[\\d.,]*)$",
    "",
    "$1 de $2"
  ],
  [
    "^(\\d[\\d.,]*)\\s*[-–]\\s*(\\d[\\d.,]*)\\s+of\\s+(\\d[\\d.,]*)$",
    "",
    "$1 - $2 de $3"
  ],
  [
    "^\\(since (.+)\\)$",
    "",
    "(desde $1)"
  ],
  [
    "^Show (\\d+) more$",
    "",
    "Mostrar $1 más"
  ],
  [
    "^(\\d+) documents? in the collection$",
    "",
    "$1 documentos en la colección"
  ],
  [
    "^(.+) in the collection$",
    "",
    "$1 en la colección"
  ],
  [
    "^Item (\\d+) of (\\d+)$",
    "",
    "Elemento $1 de $2"
  ],
  [
    "^(.+) is not available$",
    "",
    "$1 no está disponible"
  ],
  [
    "^To collection (.+)$",
    "",
    "A la colección $1"
  ],
  [
    "^Connecting to (.+)$",
    "",
    "Conectando a $1"
  ]
].map(function (r) {
    return [new RegExp(r[0], r[1]), r[2]];
  });

  var ATTRS = ['placeholder', 'title', 'aria-label', 'aria-description', 'alt'];
  var EXCLUDE = '[data-testid="document-list"],[data-testid="json-editor"],[data-testid="editable-json"],[contenteditable="true"],pre,code,.CodeMirror-code,.cm-content,.cm-line,.view-lines';
  var SINGLE_WORD = /^[A-Za-z][A-Za-z.'-]*$/;

  function isUiContext(el) {
    var p = el;
    for (var i = 0; i < 4 && p; i++, p = p.parentElement) {
      var tag = p.tagName;
      if (tag === 'BUTTON' || tag === 'A' || tag === 'LABEL' || tag === 'TH' || tag === 'OPTION' || tag === 'LEGEND' || tag === 'SUMMARY' || tag === 'H1' || tag === 'H2' || tag === 'H3' || tag === 'H4') return true;
      var role = p.getAttribute && p.getAttribute('role');
      if (role && /^(button|tab|menuitem|option|columnheader|link|checkbox|radio|switch|combobox|treeitem)$/.test(role)) return true;
      if (p.hasAttribute && (p.hasAttribute('data-testid') || p.hasAttribute('aria-label') || p.hasAttribute('title'))) return true;
    }
    return false;
  }

  function translateString(value) {
    if (!value) return value;
    var direct = DICT[value];
    if (direct !== undefined) return direct;
    var trimmed = value.trim();
    if (!trimmed) return value;
    if (trimmed !== value) {
      var t = DICT[trimmed];
      if (t !== undefined) return value.replace(trimmed, t);
      var r = applyRules(trimmed);
      if (r !== trimmed) return value.replace(trimmed, r);
      return value;
    }
    return applyRules(trimmed);
  }

  function applyRules(s) {
    for (var i = 0; i < RULES.length; i++) {
      var re = RULES[i][0];
      if (re.test(s)) return s.replace(re, RULES[i][1]);
    }
    return s;
  }

  function translateTextNode(node) {
    var value = node.nodeValue;
    if (!value) return;
    var parent = node.parentElement;
    if (parent && parent.closest && parent.closest(EXCLUDE) && !(parent.closest('.CodeMirror-placeholder') || parent.closest('.cm-placeholder'))) return;
    var trimmed = value.trim();
    if (!trimmed) return;
    if (SINGLE_WORD.test(trimmed) && parent && !isUiContext(parent)) return;
    var out = translateString(value);
    if (out !== value) node.nodeValue = out;
  }

  function translateAttributes(el) {
    if (!el.getAttribute) return;
    for (var i = 0; i < ATTRS.length; i++) {
      var a = ATTRS[i];
      if (el.hasAttribute(a)) {
        var v = el.getAttribute(a);
        var out = translateString(v);
        if (out !== v) el.setAttribute(a, out);
      }
    }
  }

  function translateSubtree(root) {
    if (!root) return;
    if (root.nodeType === 3) {
      translateTextNode(root);
      return;
    }
    if (root.nodeType !== 1 && root.nodeType !== 9 && root.nodeType !== 11) return;
    if (root.nodeType === 1) translateAttributes(root);
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT, null);
    var node;
    while ((node = walker.nextNode())) {
      if (node.nodeType === 3) translateTextNode(node);
      else translateAttributes(node);
    }
  }

  function handleMutations(muts) {
    for (var i = 0; i < muts.length; i++) {
      var m = muts[i];
      if (m.type === 'characterData') {
        translateTextNode(m.target);
      } else if (m.type === 'attributes') {
        translateAttributes(m.target);
      } else {
        for (var j = 0; j < m.addedNodes.length; j++) {
          translateSubtree(m.addedNodes[j]);
        }
        translateAttributes(m.target);
      }
    }
  }

  var observer = new MutationObserver(handleMutations);
  var observing = false;

  function observe() {
    if (observing || !document.documentElement) return;
    observing = true;
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ATTRS,
    });
  }

  function start() {
    document.documentElement.setAttribute('lang', 'es');
    if (document.title) document.title = translateString(document.title);
    translateSubtree(document.body || document.documentElement);
  }

  observe();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      observe();
      start();
    }, { once: true });
  } else {
    start();
  }

  window.__compassEs = {
    dict: DICT,
    rules: RULES,
    add: function (pairs) { for (var k in pairs) DICT[k] = pairs[k]; },
    translate: translateString,
    rescan: function () { translateSubtree(document.body); },
  };
})();
