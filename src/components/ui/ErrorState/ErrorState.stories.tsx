import type { Meta, StoryObj } from "@storybook/react";
import { ErrorState } from "./ErrorState";

const meta: Meta<typeof ErrorState> = {
  title: "UI/ErrorState",
  component: ErrorState,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ErrorState>;

export const Default: Story = {
  args: {
    message: "Failed to load tasks. Please try again.",
    onRetry: () => alert("Retrying..."),
  },
};

export const CustomTitle: Story = {
  args: {
    title: "Connection Error",
    message: "Unable to connect to the server. Check your internet connection.",
    onRetry: () => alert("Retrying..."),
  },
};

export const WithoutRetry: Story = {
  args: {
    title: "Access Denied",
    message: "You do not have permission to view this content.",
  },
};
