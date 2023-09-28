const upload = (req, res, next) => {
    const uploadedFiles = req.files.map((file) => console.log(file.filename));
    res.json({ files: uploadedFiles });
    console.log('file uploaded');
    next()
}

export default upload;