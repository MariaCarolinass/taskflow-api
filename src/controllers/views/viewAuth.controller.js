import UserRepository from "../../repositories/user.repository.js";
import bcrypt from "bcrypt";

const userRepository = new UserRepository();

export const renderRegister = (req, res) => {
  res.render("auth/register", { error: null, user: null });
};

export const renderLogin = (req, res) => {
  res.render("auth/login", { error: null, user: null });
};

export const loginView = async (req, res) => {
  const { email, password } = req.body;

  const user = await userRepository.findByEmail(email);
  if (!user) {
    return res.render("auth/login", { error: "Usuário não encontrado.", user: null });
  }

  const checkPassword = await bcrypt.compare(password, user.password);
  if (!checkPassword) {
    return res.render("auth/login", { error: "Senha incorreta.", user: null });
  }

  req.session.user = {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
  };

  return res.redirect("/dashboard");
};

export const registerView = async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await userRepository.findByEmail(email);
  if (existingUser) {
    return res.render("auth/register", { error: "Email já está em uso.", user: null });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await userRepository.create({
    name,
    email,
    password: hashedPassword,
    role: "user",
  });

  req.session.user = {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
  };

  return res.redirect("/dashboard");
};

export const logoutView = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
};
