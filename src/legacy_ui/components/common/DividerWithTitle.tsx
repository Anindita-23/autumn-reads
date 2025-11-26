import { FC } from "react";

interface Props {
  title?: string;
}

const DividerWithTitle: FC<Props> = ({ title }) => {
  if (!title) return null;

  return (
    <div>
      <p className="dark:bg-white dark:text-black bg-black text-white p-1 inline-block font-semibold rounded-t">
        {title}
      </p>
      <hr className="border-t my-2 border-black dark:border-white" />
    </div>
  );
};

export default DividerWithTitle;
