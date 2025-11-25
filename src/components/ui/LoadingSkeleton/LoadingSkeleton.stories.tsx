import type { Meta, StoryObj } from "@storybook/react";
import { LoadingSkeleton } from "./LoadingSkeleton";

const meta: Meta<typeof LoadingSkeleton> = {
  title: "UI/LoadingSkeleton",
  component: LoadingSkeleton,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof LoadingSkeleton>;

export const Text: Story = {
  render: () => (
    <div className="space-y-2 w-full max-w-md">
      <LoadingSkeleton variant="text" width="100%" />
      <LoadingSkeleton variant="text" width="80%" />
      <LoadingSkeleton variant="text" width="90%" />
    </div>
  ),
};

export const Card: Story = {
  render: () => (
    <div className="w-full max-w-md p-4 border border-border-light rounded-lg">
      <div className="flex items-center gap-4 mb-4">
        <LoadingSkeleton variant="circular" width={48} height={48} />
        <div className="flex-1 space-y-2">
          <LoadingSkeleton variant="text" width="60%" />
          <LoadingSkeleton variant="text" width="40%" />
        </div>
      </div>
      <LoadingSkeleton variant="rectangular" height={120} />
    </div>
  ),
};
