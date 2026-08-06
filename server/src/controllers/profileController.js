import User from '../models/User.js';
import { AppError } from '../middleware/errorHandler.js';
import bcrypt from 'bcryptjs';

export async function getProfile(req, res, next) {
  try {
    const user = await User.findById(req.user.id);
    if (!user) throw new AppError('User not found', 404);

    res.status(200).json({
      status: 'success',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          avatar: user.avatar,
          isEmailVerified: user.isEmailVerified,
          createdAt: user.createdAt,
          addresses: user.addresses,
        },
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function updateProfile(req, res, next) {
  try {
    const { name, phone } = req.body;
    const updates = {};
    if (name !== undefined) updates.name = name;
    if (phone !== undefined) updates.phone = phone;

    const user = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!user) throw new AppError('User not found', 404);

    res.status(200).json({
      status: 'success',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          avatar: user.avatar,
          isEmailVerified: user.isEmailVerified,
          createdAt: user.createdAt,
          addresses: user.addresses,
        },
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function uploadAvatarHandler(req, res, next) {
  try {
    if (!req.file) throw new AppError('Please upload an image', 400);

    const base64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { avatar: base64 },
      { new: true }
    );

    if (!user) throw new AppError('User not found', 404);

    res.status(200).json({
      status: 'success',
      data: { avatar: user.avatar },
    });
  } catch (error) {
    next(error);
  }
}

export async function removeAvatar(req, res, next) {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { avatar: '' },
      { new: true }
    );

    if (!user) throw new AppError('User not found', 404);

    res.status(200).json({
      status: 'success',
      data: { avatar: '' },
    });
  } catch (error) {
    next(error);
  }
}

export async function changePassword(req, res, next) {
  try {
    const { newPassword } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) throw new AppError('User not found', 404);

    user.password = newPassword;
    await user.save();

    const token = (await import('../services/authService.js')).generateAccessToken(user._id);

    res.status(200).json({
      status: 'success',
      data: { accessToken: token },
      message: 'Password updated successfully',
    });
  } catch (error) {
    next(error);
  }
}

export async function getAddresses(req, res, next) {
  try {
    const user = await User.findById(req.user.id);
    if (!user) throw new AppError('User not found', 404);

    res.status(200).json({
      status: 'success',
      data: { addresses: user.addresses },
    });
  } catch (error) {
    next(error);
  }
}

export async function createAddress(req, res, next) {
  try {
    const user = await User.findById(req.user.id);
    if (!user) throw new AppError('User not found', 404);

    if (req.body.isDefault) {
      user.addresses.forEach((addr) => { addr.isDefault = false; });
    }

    if (user.addresses.length === 0) {
      req.body.isDefault = true;
    }

    user.addresses.push(req.body);
    await user.save();

    const newAddress = user.addresses[user.addresses.length - 1];

    res.status(201).json({
      status: 'success',
      data: { address: newAddress },
    });
  } catch (error) {
    next(error);
  }
}

export async function updateAddress(req, res, next) {
  try {
    const user = await User.findById(req.user.id);
    if (!user) throw new AppError('User not found', 404);

    const address = user.addresses.id(req.params.addressId);
    if (!address) throw new AppError('Address not found', 404);

    if (req.body.isDefault) {
      user.addresses.forEach((addr) => { addr.isDefault = false; });
    }

    Object.assign(address, req.body);
    await user.save();

    res.status(200).json({
      status: 'success',
      data: { address },
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteAddress(req, res, next) {
  try {
    const user = await User.findById(req.user.id);
    if (!user) throw new AppError('User not found', 404);

    const address = user.addresses.id(req.params.addressId);
    if (!address) throw new AppError('Address not found', 404);

    const wasDefault = address.isDefault;
    user.addresses.pull(req.params.addressId);

    if (wasDefault && user.addresses.length > 0) {
      user.addresses[0].isDefault = true;
    }

    await user.save();

    res.status(200).json({
      status: 'success',
      data: { addresses: user.addresses },
    });
  } catch (error) {
    next(error);
  }
}

export async function setDefaultAddress(req, res, next) {
  try {
    const user = await User.findById(req.user.id);
    if (!user) throw new AppError('User not found', 404);

    user.addresses.forEach((addr) => {
      addr.isDefault = addr._id.toString() === req.params.addressId;
    });

    await user.save();

    res.status(200).json({
      status: 'success',
      data: { addresses: user.addresses },
    });
  } catch (error) {
    next(error);
  }
}
