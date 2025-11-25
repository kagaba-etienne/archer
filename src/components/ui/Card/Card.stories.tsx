import type { Meta, StoryObj } from "@storybook/react";
import { Card, CardHeader, CardFooter } from "./Card";
import { Button } from "../Button";

const meta: Meta<typeof Card> = {
  title: "UI/Card",
  component: Card,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  render: () => (
    <Card>
      <h3 className="text-lg font-semibold mb-2">Card Title</h3>
      <p className="text-text-secondary">
        This is a basic card component with some content inside.
      </p>
    </Card>
  ),
};

export const Hoverable: Story = {
  render: () => (
    <Card hoverable>
      <h3 className="text-lg font-semibold mb-2">Hoverable Card</h3>
      <p className="text-text-secondary">
        Hover over this card to see the effect.
      </p>
    </Card>
  ),
};

export const WithHeaderAndFooter: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold">Complete Task</h3>
      </CardHeader>
      <p className="text-text-secondary">
        Are you sure you want to mark this task as complete?
      </p>
      <CardFooter>
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="sm">
            Cancel
          </Button>
          <Button variant="primary" size="sm">
            Confirm
          </Button>
        </div>
      </CardFooter>
    </Card>
  ),
};

export const NoPadding: Story = {
  render: () => (
    <Card padding="none">
      <img
        src="https://via.placeholder.com/400x200"
        alt="Placeholder"
        className="rounded-t-lg w-full"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">Image Card</h3>
        <p className="text-text-secondary">
          Card with no padding to accommodate full-width images.
        </p>
      </div>
    </Card>
  ),
};
