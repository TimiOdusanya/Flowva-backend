import User from "../models/UserProfile.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { generateOTP, sendEmail } from "../../../utils/otpUtils";


export const signup = async (userData: any) => {
  const existingUser = await User.findOne({ email: userData.email });
  if (existingUser) throw new Error("User with this email already exists.");

  const user = new User(userData);

//   const otp = generateOTP();
//   user.verificationOTP = otp;
//   await user.save();

  await sendEmail(user.email, "welcomeEmail", {
    subject: "Welcome to Flowva",
    body: "Thank you for signing up! We're excited to have you on board.",
    buttonText: "Get Started",
    buttonLink: "https://flowva-dashboard.vercel.app",
  });

//   await sendEmail(user.email, "accountVerification", {
//     subject: "Verify Your Account",
//     body: "Your One-Time Password (OTP) to verify your account is:",
//     otp,
//   });
  await user.save();
  return user;
};

export const login = async (email: string, password: string) => {
  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    throw new Error("Invalid email or password");
  }

  const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
    expiresIn: "2d",
  });

  return { user, accessToken };
};

export const forgotPassword = async (email: string) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("User with that email not found");

  const otp = generateOTP();
  user.resetPasswordOTP = otp;
  await user.save();

  await sendEmail(user.email, "passwordReset", {
    subject: "Password Reset Request",
    body: "Your One-Time Password (OTP) to reset your password is:",
    otp,
  });

  return { message: "Steps to reset password has been sent to email" };
};

export const resetPassword = async (email: string, newPassword: string) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");

  const isNewPasswordSame = await bcrypt.compare(newPassword, user.password);
  if (isNewPasswordSame) throw new Error("New password cannot be the same as the old password");

  user.password = newPassword;
  await user.save();

  return { message: "Password reset successfully" };
};

export const verifyAccount = async (email: string, otp: string) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");
  if (user.verificationOTP !== otp) throw new Error("Invalid OTP");

  user.isVerified = true;
  user.verificationOTP = undefined;
  await user.save();

  return { message: "Account verified successfully" };
};

export const verifyForgotPassword = async (email: string, otp: string) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");
  if (user.resetPasswordOTP !== otp) throw new Error("Invalid OTP");

  user.isVerified = true;
  user.resetPasswordOTP = undefined;
  await user.save();

  return { message: "Account verified successfully" };
};

export const resendVerificationOTP = async (email: string) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");

  const otp = generateOTP();
  user.verificationOTP = otp;
  await user.save();

  await sendEmail(user.email, "accountVerification", {
    subject: "Verify Your Account",
    body: "Your One-Time Password (OTP) to verify your account is:",
    otp,
  });

  return { message: "New OTP sent to email" };
};

export const getUserProfile = async (userId: string) => {
  return await User.findById(userId);
};
