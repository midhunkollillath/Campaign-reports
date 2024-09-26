
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import {User} from '../model/userModel.js';


export const login = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ where: { username } });
  if (!user) return res.status(404).json({ message: 'User not found' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ userId: user.id }, 'secretKey', { expiresIn: '1h' });
  res.status(200).json({ token });
};
