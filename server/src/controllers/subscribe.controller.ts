import type { Request, Response } from "express";
import { Subscriber } from "../models/Subscribe.model.js";

export const subscribe = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { email } = req.body as { email?: unknown };

    // Validate email input
    if (typeof email !== "string" || !email.trim()) {
      res.status(400).json({
        success: false,
        message: "Email is required",
      });
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
      normalizedEmail.length > 254 ||
      !emailRegex.test(normalizedEmail)
    ) {
      res.status(400).json({
        success: false,
        message: "Please provide a valid email address",
      });
      return;
    }

    // Check whether the email already exists
    const existingSubscriber = await Subscriber.findOne({
      email: normalizedEmail,
    });

    if (existingSubscriber) {
      if (existingSubscriber.isSubscribed) {
        res.status(409).json({
          success: false,
          message: "This email is already subscribed",
        });
        return;
      }

      // Allow a previously unsubscribed user to subscribe again
      existingSubscriber.isSubscribed = true;
      existingSubscriber.subscribedAt = new Date();

      await existingSubscriber.save();

      res.status(200).json({
        success: true,
        message: "You have successfully subscribed!",
      });
      return;
    }

    // Save a new subscriber
    await Subscriber.create({
      email: normalizedEmail,
    });

    res.status(201).json({
      success: true,
      message: "Successfully subscribed to TechSphere!",
    });
  } catch (error) {
    // Handle a duplicate email index race condition
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === 11000
    ) {
      res.status(409).json({
        success: false,
        message: "This email is already subscribed",
      });
      return;
    }

    console.error("Subscription error:", error);

    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};