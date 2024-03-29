const {Activity, Country} =require('../db')

const validationsPutActivity = async (req, res, next) => {
    const { name, difficulty, duration, season, countries } = req.body;
    try {
        const errors = []
        if (name && !/^[a-zA-Z']{1,46}(( ?[a-zA-Z']+)*?[a-zA-Z']{1,46})?$/.test(name)) errors.push({ error: `'${name}' must not contain numbers, symbols, special characters, or spaces at the beginning or end` });

        if (name) {
            const activity = await Activity.findOne({ where: { name: name } })
            activity ? errors.push({ error: `'${name}' already exists` }) : null;
        }

        if (difficulty && !Number(difficulty) >= 1) errors.push({ error: `'${difficulty}' must be a number` });

        if (difficulty && !(Number(difficulty) % 1 === 0)) errors.push({ error: `'${difficulty}' must be integer` });

        if (difficulty && Number(difficulty) < 1 || Number(difficulty) > 5) errors.push({ error: `'${difficulty}' must be between 1 and 5` });

        if (duration && !Number(duration) >= 1) errors.push({ error: `'${duration}' must be a number` });

        const seasonOptions = ["summer", "autumn", "winter", "spring"]

        if (season && !seasonOptions.includes(season)) errors.push({ error: `'${season}' must be ${seasonOptions}` });

        if (countries && countries.length) {
            let existCountry
            const countryErrors = await Promise.all(countries.map(async country => {
                existCountry = await Country.findByPk(country)
                if (!existCountry) return `There is no country associated with this ID '${country}'`
                else return 'ok'
            }));
            const findError = countryErrors.filter(value => value !== 'ok')
            if (findError.length) errors.push({ error: findError })
        }

        if (errors.length) return res.status(400).send(errors)
        next();
    } catch (error) {
        res.status(500).send([{ error: error.message }])
    }
}

module.exports = { validationsPutActivity }