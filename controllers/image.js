const fetchAPIData = ( req, res) => {
    
    const { input } = req.body;
    // Your PAT (Personal Access Token) can be found in the portal under Authentification
    const PAT = process.env.CLARIFAI_PAT;
    // Specify the correct user_id/app_id pairings
    // Since you're making inferences outside your app's scope
    const USER_ID = 'rusith-hansana';       
    const APP_ID = 'face-detection-brain-app';
    // Change these to whatever model and image URL you want to use
    const MODEL_ID = 'face-detection';
    const MODEL_VERSION_ID = '6dc7e46bc9124c5c8824be4822abe105';    
    const IMAGE_URL = input;
    
    
    const { ClarifaiStub, grpc } = require("clarifai-nodejs-grpc");

    const stub = ClarifaiStub.grpc();

    // This will be used by every Clarifai endpoint call
    const metadata = new grpc.Metadata();
    metadata.set("authorization", "Key " + PAT);

    stub.PostModelOutputs(
        {
            user_app_id: {
                "user_id": USER_ID,
                "app_id": APP_ID
            },
            model_id: MODEL_ID,
            version_id: MODEL_VERSION_ID, // This is optional. Defaults to the latest model version
            inputs: [
                { data: { image: { url: IMAGE_URL, allow_duplicate_url: true } } }
            ]
        },
        metadata,
        (err, response) => {
            if (err) {
                throw new Error(err);
            }

            if (response.status.code !== 10000) {
                throw new Error("Post model outputs failed, status: " + response.status.description);
            }

            // Since we have one input, one output will exist here
            const output = response.outputs[0].data.regions.map((region) => {
                const boundingBox = region.region_info.bounding_box;
        
                return {
                  leftCol: boundingBox.left_col,
                  topRow: boundingBox.top_row,
                  rightCol: boundingBox.right_col,
                  leftRow: boundingBox.bottom_row
                }
              }
            );
        
            return res.json(output); 
        }

    );
}



const updateEntries = (req, res, knex) => {
    const { id } = req.body;
    knex('users')
        .where('id', '=', id)
        .increment('entries', 1) //increment increments the value by the given argument
        .returning('entries')
        .then(entr => res.json(entr[0].entries))
        .catch(err => res.status(400).json('Unable to get entries'));
}

module.exports = { 
    updateEntries,
    fetchAPIData
};