import Pizza from '../models/Pizza.js';
import { AppError } from '../middleware/errorHandler.js';

export async function getAllPizzas(req, res, next) {
  try {
    const {
      search,
      category,
      isAvailable,
      isFeatured,
      isPopular,
      sort = '-rating',
      page = 1,
      limit = 12,
    } = req.query || {};

    const filter = {};

    if (search) {
      filter.$text = { $search: search };
    }

    if (category) {
      filter.category = category;
    }

    if (isAvailable !== undefined) {
      filter.isAvailable = isAvailable === 'true';
    }

    if (isFeatured !== undefined) {
      filter.isFeatured = isFeatured === 'true';
    }

    if (isPopular !== undefined) {
      filter.isPopular = isPopular === 'true';
    }

    const sortMap = {
      rating: { rating: -1 },
      '-rating': { rating: 1 },
      price: { basePrice: 1 },
      '-price': { basePrice: -1 },
      popular: { orderCount: -1 },
      '-popular': { orderCount: 1 },
      newest: { createdAt: -1 },
      '-newest': { createdAt: 1 },
      name: { name: 1 },
      '-name': { name: -1 },
    };

    const sortOptions = sortMap[sort] || sortMap['-rating'];
    const skip = (page - 1) * limit;

    const [pizzas, total] = await Promise.all([
      Pizza.find(filter).sort(sortOptions).skip(skip).limit(limit),
      Pizza.countDocuments(filter),
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        pizzas,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getPizzaById(req, res, next) {
  try {
    const pizza = await Pizza.findById(req.params.id);

    if (!pizza) {
      throw new AppError('Pizza not found', 404);
    }

    res.status(200).json({
      status: 'success',
      data: { pizza },
    });
  } catch (error) {
    next(error);
  }
}

export async function getCategories(req, res, next) {
  try {
    const categories = await Pizza.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          availableCount: {
            $sum: { $cond: ['$isAvailable', 1, 0] },
          },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const formatted = categories.map((cat) => ({
      id: cat._id,
      name: cat._id.charAt(0).toUpperCase() + cat._id.slice(1).replace('-', ' '),
      count: cat.count,
      availableCount: cat.availableCount,
    }));

    res.status(200).json({
      status: 'success',
      data: { categories: formatted },
    });
  } catch (error) {
    next(error);
  }
}
