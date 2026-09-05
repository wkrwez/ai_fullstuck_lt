import { useDrop } from "react-dnd";
import type { CommonComponentProps } from "../../interface";
import { useComponetsStore } from "../../store/components";
import { useComponentConfigStore } from "../../store/component-config";

function Page({ id, name, children }: CommonComponentProps) {
  const { addComponent } = useComponetsStore();
  const { componentConfig } = useComponentConfigStore();

  const [{ canDrop }, drop] = useDrop(() => ({
    accept: ["Button", "Container"],
    drop: (item: { type: string }) => {
      const props = componentConfig[item.type].defaultProps;

      addComponent(
        {
          id: new Date().getTime(),
          name: item.type,
          props,
        },
        id,
      );
    },
    collect: (monitor) => ({
      canDrop: monitor.canDrop(),
    }),
  }));

  return (
    <div
      ref={drop}
      className="p-5 h-full box-border"
      style={{ border: canDrop ? "2px solid blue" : "none" }}
    >
      {children}
    </div>
  );
}

export default Page;
