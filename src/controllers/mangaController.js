exports.createManga = async (req, res, next) => {
  res.status(201).json({ message: 'Manga created' });
};

exports.getManga = async (req, res, next) => {
  res.json({ message: 'Get manga list' });
};

exports.getMangaById = async (req, res, next) => {
  res.json({ message: 'Get manga by id' });
};

exports.updateManga = async (req, res, next) => {
  res.json({ message: 'Manga updated' });
};

exports.deleteManga = async (req, res, next) => {
  res.status(204).send();
}; 