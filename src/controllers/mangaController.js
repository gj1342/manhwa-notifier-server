export const createManga = async (req, res, next) => {
  res.status(201).json({ message: 'Manga created' });
};

export const getManga = async (req, res, next) => {
  res.json({ message: 'Get manga list' });
};

export const getMangaById = async (req, res, next) => {
  res.json({ message: 'Get manga by id' });
};

export const updateManga = async (req, res, next) => {
  res.json({ message: 'Manga updated' });
};

export const deleteManga = async (req, res, next) => {
  res.status(204).send();
}; 