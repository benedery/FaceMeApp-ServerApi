const Clarifai = require('clarifai');
const app = new Clarifai.App({
    apiKey: '241bb560b81c497fb9cc50669a646f09'
});

const handleApiCall = (req,res) => {
    app.models
        .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
        .then(data=>{
            res.json(data)
        }).catch(err=>{res.status(400).json('unable to work with API')})
};

const updateEntries = (req,res,db)=>{
    const { id } = req.body;
    db
        .returning('entries')
        .select('*').from('users').where({id}).increment('entries', 1)
        .then(userEntries => {
                if (userEntries) {
                    res.json(userEntries[0])
                } else {
                    res.status(400).json('could not find user id')
                }
            }
        )};

module.exports = {
    updateEntries,
    handleApiCall
}