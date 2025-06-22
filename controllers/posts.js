/**
 * 
 * Notas:
 * - userId se ha de extraer del id del usuario (de momento pasalo por ruta)
 * - hay muchos campos a rellenar con arrays diferentes, el único obligatorio a rellenar es el de mood
 * - 
 */

const { postsModel } = require("../models");
const posts = require("../models/nosql/posts");
const uploadToPinata = require("../utils/handleUploadIPFS");
const { handleHttpError } = require("../utils/handleError");

const getAllPosts = async (req, res) => {
    try {
        const id = req.params.id;
        const posts = await postsModel.find({userId: id});
        res.send({ posts });
    } catch (error) {
        console.log("Error getting all posts: ", error);
        res.status(500).send("GET_ALL_POSTS_ERROR");
    }
};

const getOnePost = async (req, res) => {
    try {
        const id = req.params.id;
        const post = await postsModel.findById(id);

        if (!post) {
            res.status(404).end(`No post with id ${id}`);
            return;
        }
        res.send(post);
    } catch (error) {
        console.log("Error getting post: ", error);
        res.status(500).send("GET_POST_ERROR");
    }
};

// const createPost = async (req, res) => {
//     try {
//         //const userId = req.params.userId;
//         const { body } = req;
//         const post = await postsModel.create(body);
//         res.send(post);
//     } catch (error) {
//         console.log("Error creating post: ", error);
//         res.status(500).send("CREATE_POST_ERROR");
//     }
// };

const createPost = async (req, res) => {
    try {
        const { body } = req;
        const files = req.files || [];

        const postData = JSON.parse(body.post);

        const images = await uploadImagesToPinata(files);

        postData.images = images;

        const post = await postsModel.create(postData);
        res.send(post);
    } catch (error) {
        console.log("Error creating post: ", error);
        res.status(500).send("CREATE_POST_ERROR", error);
    }
};


const updatePost = async (req, res) => {
    try {
        const id = req.params.id;
        const { body } = req;
        const files = req.files || [];

        const postData = JSON.parse(body.post);

        const newImages = await uploadImagesToPinata(files);

        postData.images = newImages;

        const postActualizado = await postsModel.findOneAndUpdate({_id: id}, postData, {new: true});
        if (!postActualizado) {
            res.status(404).send("El post a actualizar no existe.");
            return;
        }
        res.send(postActualizado);
    } catch (error) {
        console.log("Error updating post: ", error);
        res.status(500).send("UPDATE_POST_ERROR",error);
    }
};

const uploadImagesToPinata = async (files)=> {
    const uploadedImages = [];

    for (let file of files) {
        const fileBuffer = file.buffer;
        const fileName = file.originalname;

        const pinataResponse = await uploadToPinata(fileBuffer, fileName);
        const ipfsFile = pinataResponse.IpfsHash;
        const ipfs = `https://${process.env.PINATA_GATEWAY_URL}/ipfs/${ipfsFile}`;

        uploadedImages.push(ipfs);
    }

    return uploadedImages;
};

// Obtener todos los posts de un usuario por su id
const getPosts = async (id) => {
    try {
        const posts = await postsModel.find({ userId: id });
        return posts;
    } catch (error) {
        console.log("Error getting posts:\n", error);
        throw new Error("GET_POSTS_ERROR");
    }
};

// Obtener los posts de los últimos 30 días de un usuario por su id
const getRecentPosts = async (id) => {
    try {
        // Obtener la fecha actual
        const thirtyDaysAgo = new Date();

        // Obtener la fecha de hace 30 días
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        // Buscar los posts del usuario que se hayan creado en o después de la fecha obtenida
        const posts = await postsModel.find({
            userId: id,
            createdAt: { $gte: thirtyDaysAgo }
        });

        return posts;
    } catch (error) {
        console.log("Error getting recent posts:\n", error);
        throw new Error("GET_RECENT_POSTS_ERROR");
    }
};

const getPostsByMood = async (id, mood) => {
    try {
        const posts = await postsModel.find({
            userId: id,
            mood: mood
        });

        return posts;
    } catch (error) {
        console.log("error getting posts by mood:\n", error);
        throw new Error("GET_POSTS_BY_MOOD_ERROR");
    }
};

const getPostsByMonth = async (id, monthQuery, yearQuery) => {
    try {
        const month = parseInt(monthQuery);
        const year = parseInt(yearQuery);

        if (!month || !year) {
            console.warn("You must provide a month and year");
            throw new Error("NO_MONTH_OR_YEAR_PROVIDED");
        }

        const monthStart = new Date(year, month - 1, 1);
        const monthEnd = new Date(year, month, 1);

        const posts = await postsModel.find({userId: id, createdAt: {$gte: monthStart, $lt: monthEnd}}).select("createdAt mood");

        return posts;
    } catch (error) {
        console.log("Error in getting posts by month:\n", error);
        throw new Error("GET_POSTS_BY_MONTH");
    }
};

// Obtener la media del mood por cada día de la semana
const getWeekdaysMoodMedia = async (req, res) => {
    
    // Definición de los días de la semana
    const dayOfTheWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    
    // Definición de los valores de cada mood
    const valueByMood = {"Miserable": -2, "Sad": -1, "Neutral": 0, "Happy": 1, "Ecstatic": 2};
    
    // Objeto que contiene el mood total, los días totales y la media del mood en base a los dos datos anteriores por cada día de la semana
    const media = {"Monday": {"totalMood": 0, "totalDays": 0, "moodMedia": 0}, 
                    "Tuesday": {"totalMood": 0, "totalDays": 0, "moodMedia": 0}, 
                    "Wednesday": {"totalMood": 0, "totalDays": 0, "moodMedia": 0}, 
                    "Thursday": {"totalMood": 0, "totalDays": 0, "moodMedia": 0}, 
                    "Friday": {"totalMood": 0, "totalDays": 0, "moodMedia": 0}, 
                    "Saturday": {"totalMood": 0, "totalDays": 0, "moodMedia": 0}, 
                    "Sunday": {"totalMood": 0, "totalDays": 0, "moodMedia": 0}
                };


    try {
        // Obtener id del usuario y recuperar sus posts
        const id = req.params.id;
        const posts = await getPosts(id);
        
        // Iterar sobre los posts del usuario
        for (let i = 0; i < posts.length; i++) {

            // Obtener post
            const post = posts[i];

            // Obtener mood del post
            const mood = post.mood;

            // Obtener nombre del día de la semana de la creación del post
            const day = dayOfTheWeek[new Date(post.createdAt).getUTCDay()];

            // Suma al total de mood y días totales de ese día de la semana
            media[day].totalMood += valueByMood[mood];
            media[day].totalDays += 1;
        }

        // Iteración sobre el objeto con la información de los días de la semana para el calculo de la media del mood
        for (const day in media) {

            // Obtención de los datos de mood total y días totales del día de la semana
            const { totalMood, totalDays } = media[day];
            
            // Se comprueba que haya información de ese día de la semana
            if (totalDays === 0) {

                // Si no hay información, el mood medio es 0
                media[day].moodMedia = 0;
            } else {

                // Se calcula la media sin redondear
                const rawMedia = totalMood / totalDays;

                // Se redondea a un decimal la media anterior
                const roundedMedia = Math.round(rawMedia * 10) / 10;

                // Se asigna la media redondeada a ese día de la semana
                media[day].moodMedia = roundedMedia;
            }
        }
        
        // Objeto con los resultados
        const result = {};

        // Se itera de nuevo sobre el objeto con la información de cada día de la semana
        for (const day in media) {

            // En el objeto a enviar se pone como clave el día de la semana y la media de mood como valor
            result[day] = media[day].moodMedia;
        }

        res.send(result);
    } catch (error) {
        console.log("Error in getting week days mood media:\n", error);
        handleHttpError(res, { message: "Error in getting week days mood media" }, 500);
    }
};

const getSleepHoursMoodMedia = async (req, res) => {

    // Asignación del valor de cada mood    
    const valueByMood = {"Miserable": -2, "Sad": -1, "Neutral": 0, "Happy": 1, "Ecstatic": 2};
    
    // Objeto con las opciones de sleepHours junto a información como mood total, cantidad total y la media de mood
    const media = {"0": {"totalMood": 0, "totalCount": 0, "moodMedia": 0}, 
                    "1to4": {"totalMood": 0, "totalCount": 0, "moodMedia": 0}, 
                    "5to7": {"totalMood": 0, "totalCount": 0, "moodMedia": 0}, 
                    "8to10": {"totalMood": 0, "totalCount": 0, "moodMedia": 0}, 
                    "more10": {"totalMood": 0, "totalCount": 0, "moodMedia": 0}, 
                };
    try {

        // Búsqueda de posts del usuario
        const id = req.params.id;
        const posts = await getPosts(id);

        // Iteración sobre los posts
        for (let i = 0; i < posts.length; i++) {

            // Obtención del post, su mood y los sleepHours
            const post = posts[i];
            const mood = post.mood;
            const sleepHours = post.sleepHours;

            // Se comprueba que el post contenga sleepHours
            if (sleepHours) {

                // Se suma el valor del mood al mood total y aumenta la cantidad total en uno de esa opción de sleepHours
                media[sleepHours].totalMood += valueByMood[mood];
                media[sleepHours].totalCount += 1;
            }
        }

        // Iteración sobre el objeto que contiene la información de cada opción de sleepHours
        for (const sleepHoursOption in media) {

            // Obtención de los datos de mood total y cantidad total de una opción de sleepHours
            const { totalMood, totalCount } = media[sleepHoursOption];

            // Comprobación de que la opción de sleepHours tiene información
            if (totalCount === 0) {

                // Si no lo tiene, la media de mood es 0
                media[sleepHoursOption].moodMedia = 0;
            } else {

                // Se calcula la media de mood 
                const rawMedia = totalMood / totalCount;

                // Se redondea la media a un decimal
                const roundedMedia = Math.round(rawMedia * 10) / 10;

                // Se asigna esa media a la opción correspondiente de sleepHours
                media[sleepHoursOption].moodMedia = roundedMedia;
            }
        }
        
        // Creación del objeto que se enviará como respuesta
        const result = {};

        // Iteración sobre el objeto con la información de cada opción de sleepHours
        for (const sleepHoursOption in media) {

            // Al objeto de respuesta se añade la opción como clave y su media de mood como valor
            result[sleepHoursOption] = media[sleepHoursOption].moodMedia;
        }

        res.send(result);
    } catch (error) {
        console.log("Error in getting sleep hours mood media:\n", error);
        handleHttpError(res, { message: "Error in getting sleep hours mood media" }, 500);
    }
};

// Obtención de las 5 actividades más realizadas en los últimos 30 días
const getTop5Activities = async (req, res) => {
    try {
        // Obtener posts de los últimos 30 días
        const posts = await getRecentPosts(req.params.id);
        
        // Declarar categorías de actividades
        const activityCategories = [
            "health",
            "hobbies",
            "food",
            "social",
            "productivity",
            "chores",
            "beauty"
        ];

        // Crear objeto que contendrá las actividades realizadas y el número de veces que se hacen
        const activityCount = {};

        // Iteración sobre los posts 
        posts.forEach(post => {
            
            // Iteración sobre las categorías de actividades en cada post
            activityCategories.forEach(category => {
                
                // Comprobación de que es un array cada categoría en el post
                if (Array.isArray(post[category])) {
                    
                    // Iteración sobre cada actividad realizada de esa categoría
                    post[category].forEach(activity => {
                        
                        // Comprobación de que se realizó la actividad
                        if (activity) {

                            // Se suma 1 al conteo de la actividad
                            activityCount[activity] = (activityCount[activity] || 0) + 1;
                        }
                    });
                }
            });
        });

        // Ordenación de las actividades por número de veces realizado y obtención de los 5 más realizados
        const sortedActivities = Object.entries(activityCount)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);

        // Creación del objeto de respuesta con la actividad como clave y el número de veces realizado como valor
        const top5Activities = {};

        // Iteración sobre la lista del top 5 actividades
        sortedActivities.forEach(([activity, count]) => {
            
            // Inserción de la actividad y la cantidad de veces realizada en el objeto de respuesta
            top5Activities[activity] = count;
        });

        res.send(top5Activities);
    } catch (error) {
        console.log("Error in getting top 5 activities:\n", error);
        handleHttpError(res, { message: "Error in getting top 5 activities" }, 500);
    }
};

// Obtener la actividad más realizada cuando el usuario tiene mood Ecstatic
const getBestActivity = async (req, res) => {
    try {
        // Obtención de los posts con mood Ecstatic del usuario
        const id = req.params.id;
        const posts = await getPostsByMood(id, "Ecstatic");
        
        // Definición de las categorías de actividades
        const activityCategories = [
            "health",
            "hobbies",
            "food",
            "social",
            "productivity",
            "chores",
            "beauty"
        ];

        // Objeto que contiene el número de veces que se realiza cada actividad
        const activityCount = {};

        // Iteración sobre los posts
        posts.forEach(post => {
            
            // Iteración sobre las categorías de actividades en cada post
            activityCategories.forEach(category => {
                
                // Comprobación de que es un array cada categoría en el post
                if (Array.isArray(post[category])) {
                    
                    // Iteración sobre cada actividad realizada de esa categoría
                    post[category].forEach(activity => {
                        
                        // Comprobación de que se realizó la actividad
                        if (activity) {

                            // Se suma 1 al conteo de la actividad
                            activityCount[activity] = (activityCount[activity] || 0) + 1;
                        }
                    });
                }
            });
        });

        // Variables que contendrán la actividad más realizada y la cantidad de veces que se realiza
        let topActivity = null;
        let topActivityCount = 0;

        // Iteración sobre el objeto que contiene las actividades realizadas y el número de veces que se realizó
        for (const [activity, count] of Object.entries(activityCount)) {

            // Se comprueba si la cantidad de veces que se realizó la actividad es mayor a la de la actividad antigua
            if (count > topActivityCount) {

                // Si lo es, la actividad que se envía cambia por esta y también el número de veces que se realiza
                topActivityCount = count;
                topActivity = activity;
            }
        };

        res.send({ [topActivity]: topActivityCount});
    } catch (error) {
        console.log("Error in getting best activity:\n", error);
        handleHttpError(res, { message: "Error in getting best activity" }, 500);
    }
};

const getMostActiveDay = async (req, res) => {
    try {
        // Obtener todos los posts del usuario
        const id = req.params.id;
        const posts = await getPosts(id);

        // Definición de las categorías de actividades
        const activityCategories = [
            "health",
            "hobbies",
            "food",
            "social",
            "productivity",
            "chores",
            "beauty"
        ];

        // Definición de objeto que contendrá los días y el número de actividades realizadas ese día
        const dailyActivityCount = {};

        // Iteración sobre los posts
        posts.forEach(post => {

            // Obtención solamente del día del post, sin la hora
            const postDay = new Date(post.createdAt).toISOString().split("T")[0];
            
            // Comprobar que en el objeto con los días y su número de actividades está este día
            if (!dailyActivityCount[postDay]) {

                // Si no, se añade al objeto y se inicializa su contador a 0
                dailyActivityCount[postDay] = 0;
            }

            // Iteración sobre cada categoría de actividad
            activityCategories.forEach(category => {

                // Se suma la cantidad de actividades de la categoría al número de actividades del día
                dailyActivityCount[postDay] += post[category].length;
            });
        });

        // Variables que guardarán el día más activo y su número de actividades realizadas
        let mostActiveDay = null;
        let mostActiveDayCount = 0;

        // Iteración sobre el objeto con los días y su número de actividades
        for (const [day, count] of Object.entries(dailyActivityCount)) {

            // Se comprueba si el número de actividades del día es mayor a la del día anterior
            if (count > mostActiveDayCount) {

                // Si es así, el día que se envía cambia por este y también su número de actividades realizadas
                mostActiveDayCount = count;
                mostActiveDay = day;
            }
        };

        // Definición del array que se envía, con el día más activo y su número de actividades realizadas
        const result = [mostActiveDay, mostActiveDayCount];

        res.send(result);
    } catch (error) {
        console.log("Error getting most active day:\n", error);
        handleHttpError(res, { message: "Error in getting most active day" }, 500);
    }
};

const getEnergyAndSleepQuality = async (req, res) => {
    try {
        const id = req.params.id;
        const posts = await getRecentPosts(id);

        const result = {"energy": [], "sleep": []};

        posts.forEach(post => {
            const postEnergy = post.energy || 0;
            const postSleepQuality = post.sleepQuality || 0;
            
            result.energy.push(postEnergy);
            result.sleep.push(postSleepQuality)
        });

        res.send(result);
    } catch (error) {
        console.log("Error in getting energy and sleep quality:\n", error);
        handleHttpError(res, { message: "Error in getting energy and sleep quality" }, 500);
    }
};

const getMonthInformation = async (req, res) => {
    try {
        const id = req.params.id;
        const month = req.query.month;
        const year = req.query.year;

        const posts = await getPostsByMonth(id, month, year);
        
        res.send(posts);
    } catch (error) {
        console.log("Error getting month information:\n", error);
        handleHttpError(res, { message: "Error in getting month information" }, 500);
    }
};

const getActivitiesPreferencesByMood = async (req, res) => {
    try {
        const id = req.params.id;
        const mood = req.params.mood;

        let posts;

        if (mood !== "mean") {
            posts = await getPostsByMood(id, mood);
        } else {
            posts = await getPosts(id);
        }

        const activityCategories = [
            "health",
            "hobbies",
            "food",
            "social",
            "productivity",
            "chores",
            "beauty"
        ];

        const activitiesCount = {};

        activityCategories.forEach(category => {
            activitiesCount[category] = 0;
        });

        activitiesCount["total"] = 0;

        posts.forEach(post => {
            activityCategories.forEach(category => {
                const activityCategoryNumber = post[category].length;
                activitiesCount[category] += activityCategoryNumber;
                activitiesCount["total"] += activityCategoryNumber;
            });
        });

        Object.keys(activitiesCount).forEach(category => {
            if (category !== "total") {
                const result = (activitiesCount[category] / activitiesCount["total"]) * 10;
                const parsedResult = Math.min(Math.floor(result), 10);
                activitiesCount[category] = parsedResult;
            }
        });

        delete activitiesCount["total"];

        res.send(activitiesCount);
    } catch (error) {
        console.log("Error in getting activities preferences by mood:\n", error);
        handleHttpError(res, { message: "Error in getting activities preferences by mood" }, 500);
    }
};

module.exports = {
    getAllPosts,
    getOnePost,
    createPost,
    updatePost,
    getWeekdaysMoodMedia,
    getSleepHoursMoodMedia,
    getTop5Activities,
    getBestActivity,
    getMostActiveDay,
    getEnergyAndSleepQuality,
    getMonthInformation,
    getActivitiesPreferencesByMood
};