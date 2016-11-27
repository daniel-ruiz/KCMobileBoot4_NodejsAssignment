#Nodepop

##Descripción

Esta aplicación consiste en un API que permite que sus usarios publiquen anuncios de artículos que desean vender, o bien anuncien sus deseos de comprar cierto producto. 

De esta forma, **Nodepop** pretende convertirse en la mayor comunidad de compra-venta de bienes de segunda mano entre usuarios.

##Despliegue

Como parte de la práctica del módulo de *devops* del [Startup Engineering Master de KeepCoding](https://keepcoding.io/es/keepcodingstartupengineeringmasterbootcamp/), este proyecto está desplegado en la URL del siguiente [link](http://nodepop.danruicar.com/).

##Instalación del Proyecto

###Requisitos Previos

Este proyecto ha sido creado empleando [Node.js](https://nodejs.org) y [MongoDB](https://www.mongodb.com), por lo que a lo largo de esta guía de instalación se asume que el usuario tiene instalada una versión de Node.js igual o superior a la v4.6.0 y tiene un servidor de MongoDB (preferiblemente versión 3) escuchando en la dirección por defecto (127.0.0.1:27017).

En caso contrario, diríjase a la documentación oficial de cada proyecto para instalar Node.js y MongoDB.

###Resolución de Dependencias

Una vez que se cumplen los requisitos del apartado anterior, lo primero que se debe hacer tras descargarse este repositorio es resolver las dependencias del proyecto. Ello se realiza ejecutando en un terminal el comando `npm install` (asegúrese de situarse en el directorio raíz del proyecto).

###Población de la Base de Datos

Esta aplicación incluye un script de precarga de anuncios en base de datos, para evitar así que cada usuario tenga que invertir mucho esfuerzo en empezar a consumir datos del API.

Para ejecutar dicho script tan sólo hay que ejecutar el comando `npm run dbSeed`.

###Arranque del Servidor

Una vez poblada la base de datos, ¡es hora de arrancar la aplicación! Ejecutando `npm start` se arrancará la aplicación, que estará escuchando peticiones en la dirección http://127.0.0.1:3000.
 
##Creación de Usuarios

Por motivos de seguridad se ha desestimado precargar usuarios en la base de datos, por lo que será necesario crear a lo sumo un usuario para empezar a usar el API.

Esto se consigue realizando una petición **POST** al endpoint **/api/v1/users**. En el cuerpo de la petición deberá incluirse los siguientes parámetros en formato *x-www-form-urlencoded* (de ahora en adelante se entenderá que éste es el formato predeterminado en el que deben ir codificados los parámetros):
* **name**: Cadena de texto con el nombre del usuario.
* **email**: Cadena de texto con el email del usuario. Este email debe ser único en la base de datos.
* **password**: Cadena de texto con la contraseña. Debe tener una longitud mínima de 8 caracteres.

##Autenticación

Esta aplicación emplea autenticación para proteger el acceso a usuarios no registrados. El método de autenticación empleado es [JWT](https://jwt.io/), que consiste en un procedimiento para generar un token que identifique unívocamente a un usuario y sea robusto ante modificaciones no permitidas.

Para obtener un token hay que realizar una petición **POST** al endpoint **/api/v1/login**, indicando en el cuerpo de la petición los siguientes parámetros:
* **email**: El email del usuario con el que queremos iniciar sesión.
* **password**: La contraseña del usuario.

Si las credenciales son correctas, la aplicación nos devolverá el token JWT asociado al usuario. Para que la aplicación nos pueda reconocer como usuario autenticado es necesario incluir en nuestras peticiones la cabecera `Authorization` con el valor `Bearer <token_obtenido>` (nótese el espacio existente entre *Bearer* y el token que obtenemos tras el login).

##API

###v1

#### Recursos

#####Ads

Los *Ads* son los anuncios que se almacenan en la aplicación. Cada anuncio se compone de los siguientes elementos:
* **name**: Contiene la descripción del artículo al que hace referencia el anuncio.
* **type**: Actualmente, los anuncios pueden ser de dos tipos: de venta (*SELL*) o compra(*BUY*).
* **price**: Indica el precio de venta del artículo o bien el precio que el comprador está dispuesto a pagar.
* **photo**: URL de la foto adjunta al anuncio. En posteriores versiones la aplicación soportará el servicio de descarga de las imágenes a través de su enlace.
* **tags**: Los anuncios tienen asociados una lista de etiquetas para facilitar su categorización.

######GET /api/v1/ads

Lista los anuncios almacenados en la aplicación.

* Esta llamada requiere autenticación previa.
* Los siguientes parámetros opcionales permitidos se pueden incluir tanto en el cuerpo de la petición como en el *query string*:
    * **name**: Cadena de texto que filtra los anuncios cuyo nombre empiece por el valor proporcionado.
    * **type**: Filtra por anuncios de tipo *BUY* o tipo *SELL*. Si su valor no es adecuado, este parámetro se ignorará.
    * **minPrice** y **maxPrice**: Parámetros que especifican el rango de precio de los anuncios mostrados. Se puede establecer el mismo valor para ambos parámetros y así buscar anuncios con un precio determinado. Si se pusiera un valor en **minPrice** más elevado que el de **maxPrice**, no se mostraría ningún anuncio.
    * **tags**: Lista de etiquetas por las que filtrar. Se mostrarán los anuncios que tengan al menos una etiqueta en común con las especificadas en este parámetro.
    * **page** y **perPage**: Parámetros que controlan el número de resultados mostrados. **page** indica el número de página que el servidor debe devolver, mientras que **perPage** indica el número de elementos que contiene cada página.
    * **sort**: Los anuncios mostrados se pueden ordenar respecto al valor del campo proporcionado en este parámetro. Por defecto, se ordenan los resultados de forma ascendente a menos que el valor de este parámetro empiece por el caracter '-'.
    
* Si todo ha ido bien, la respuesta a esta petición tendrá los siguientes parámetros:
    * **status**: 200
    * **name**: 'OK'
    * **message**: 'Ads successfully retrieved'
    * **ads**: Un array con los valores de cada anuncio
    * **total**: El número total de anuncios que cumplen el criterio de filtrado
    * **perPage**: El número de anuncios que contiene cada página de resultados
    * **page**: Página actual de resultados que se está sirviendo
    * **pages**: Número total de páginas de resultados

#####Login

######POST /api/v1/login

Endpoint al que se debe llamar para autenticar un usuario.

* Esta llamada no requiere autenticación previa.
* La llamada acepta los siguientes parámetros en el cuerpo de la petición:
    * **email**: El email del usuario con el que queremos iniciar sesión.
    * **password**: La contraseña del usuario.
* Si todo ha ido bien, la respuesta a esta petición tendrá los siguientes parámetros:
    * **status**: 201
    * **name**: 'Created'
    * **message**: 'Logged in successfully'
    * **token**: Token JWT generado tras el proceso de autenticación

#####Tags

Los *Tags* son las etiquetas con las que se categoriza cada anuncio. Básicamente, una etiqueta se compone de un único campo **name** que contiene una cadena de texto que representa su nombre.

######GET /api/v1/tags

Lista todas las etiquetas definidas en la aplicación.

* Esta llamada requiere autenticación previa.
* Esta llamada no recibe parámetros adicionales.
* Si todo ha ido bien, la respuesta a esta petición tendrá los siguientes parámetros:
    * **status**: 200
    * **name**: 'OK'
    * **message**: 'Tags successfully retrieved'
    * **tags**: Un array con los valores de cada etiqueta

#####Users

Este recurso hace referencia a los usuarios registrados en la aplicación. Cada usuario se compone de los siguientes campos:
* **name**: Cadena de texto con el nombre del usuario.
* **email**: Cadena de texto con el email del usuario. Este email debe ser único en la base de datos.
* **password**: Cadena de texto con la contraseña. Debe tener una longitud mínima de 8 caracteres.

######POST /api/v1/users

Registra un nuevo usuario en la aplicación.

* Esta llamada no requiere autenticación previa.
* La llamada acepta los siguientes parámetros en el cuerpo de la petición:
    * **name**: Representa el nombre que le queramos dar al nuevo usuario.
    * **email**: El email asociado al usuario. No debe coincidir con el email de ningún usuario previamente registrado en la aplicación.
    * **password**: La contraseña que le queramos proporcionar al usuario. Es necesario recordar que debe tener una longitud mínima de 8 caracteres.
* Si todo ha ido bien, la respuesta a esta petición tendrá los siguientes parámetros:
    * **status**: 201
    * **name**: 'Created'
    * **message**: 'User successfully created'
    * **user**: Objeto que muestra los valores especificados al nuevo usuario. Por razones de seguridad, se omite mostrar la contraseña.

####Respuestas de Error

A continuación se describe el formato de las posibles respuestas de error que puede devolver el API.

#####Bad Request (400)

Esta respuesta se devuelve cuando las credenciales de autenticación proporcionadas no son válidas. Su formato es el siguiente:
* **status**: 400
* **name**: 'BadRequest'
* **message**: Mensaje explicativo con las causas del error.

#####Unauthorized (401)

Este error se devuelve siempre que un usuario acceda a un endpoint que requiera autenticación y no proporcione una cabecera de autenticación válida. Su formato es el siguiente:
* **status**: 401
* **name**: 'Unauthorized'
* **message**: Mensaje explicativo con las causas del error.

#####Not Found (404)

Esta respuesta se produce a causa de acceder a una URL que no esté definida en el API. Su formato es:
* **status**: 404
* **name**: 'NotFound'
* **message**: 'The requested resource couldn't be found'

#####Method Not Allowed (405)

Este error se devuelve cuando un usuario intenta acceder a un recurso definido en el API, pero con un método HTTP que no está contemplado en el recurso en cuestión. Su formato es:
* **status**: 405
* **name**: 'MethodNotAllowed'
* **message**: Mensaje que explica que el recurso actual no es accesible mediante el método empleado.

#####Unprocessable Entity (422)

Este mensaje se recibe cuando no se han proporcionado todos los parámetros abligatorios requeridos para procesar la petición. El formato de este mensaje es:
* **status**: 422
* **name**: 'UnprocessableEntity'
* **message**: Mensaje explicativo del error.

En el caso especial de llamadas para crear usuarios, cuando se produce un error de validación se incluye en el mensaje de error el siguiente campo:
* **errors**: Array donde se lista cada uno de los errores de validación producidos, incluyendo el mensaje explicativo en cada caso.

#####Internal Server Error (500)

En la medida de lo posible, cada vez que se produzca un error inesperado mientras la aplicación está procesando una petición válida se debería devolver este error. Su formato es:
* **status**: 500
* **name**: 'InternalServerError'
* **message**: Mensaje explicativo del error.
