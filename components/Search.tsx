import { useEffect, useRef, useState } from "react";
import { OptionGroupProps, OptionProps, SelectProps } from "../types";
import styles from "../styles/Search.module.css";
import clsx from "classnames";

function Option({ value, label, onClick, closeOnClick }: OptionProps) {
  return (
    <div>
      <div
        onClick={() => {
          onClick(value, label);
          closeOnClick?.();
        }}
        className={styles.option}
      >
        {label}
      </div>
    </div>
  );
}

function OptionGroup({
  drop,
  options,
  close,
  closeOnOptionClick,
  top,
  left,
  width,
}: OptionGroupProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (
        ref.current &&
        !ref.current.contains(event.target) &&
        event.target.id !== "custom-select" &&
        event.target.id !== "custom-select-inside" &&
        event.target.id !== "custom-select-button"
      ) {
        ref.current?.close();
        close();
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  useEffect(() => {
    const handleEscape = (e: any) => {
      if (e.key === "Escape") {
        close();
        ref.current?.close();
      }
    };

    if (drop) {
      ref.current?.close();
      ref.current?.showModal();
      document.addEventListener("keydown", handleEscape);
    } else {
      close();
      ref.current?.close();
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [drop]);

  return (
    <dialog
      ref={ref}
      className={styles["option-group"]}
      style={{
        position: "absolute",
        top: top,
        left: left,
        width: width,
      }}
      onClick={(e) => {
        e.stopPropagation();
        const dialogDimensions = ref.current?.getBoundingClientRect()!;
        if (
          e.clientX < dialogDimensions.left ||
          e.clientX > dialogDimensions.right ||
          e.clientY < dialogDimensions.top ||
          e.clientY > dialogDimensions.bottom
        ) {
          close();
          ref.current?.close();
        }
      }}
    >
      {options.map((option) => {
        return (
          <Option
            value={option.value}
            label={option.label}
            onClick={option.onClick}
            closeOnClick={closeOnOptionClick}
            key={option.value}
          />
        );
      })}
    </dialog>
  );
}

export default function Select({
  selected,
  options,
  onChange,
  small,
}: SelectProps) {
  const [drop, setDrop] = useState(false);
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    onChange?.();
  }, [selected]);

  return (
    <>
      <div
        ref={divRef}
        className={
          styles[
            clsx({
              ["select-one"]:
                !drop && !selected.label?.startsWith("Seleccionar"),
              ["select-two"]: drop && selected.label?.startsWith("Seleccionar"),
              ["select-three"]:
                drop && !selected.label?.startsWith("Seleccionar"),
              ["select-four"]:
                !drop && selected.label?.startsWith("Seleccionar"),
            })
          ]
        }
        onClick={() => {
          setDrop(!drop);
        }}
        id="custom-select"
      >
        <div id="custom-select-inside" className={styles["select-input"]}>
          {selected.label}
        </div>
        <div
          id="custom-select-button"
          style={{
            position: "relative",
          }}
          className={
            styles[
              clsx({
                ["down-one"]: drop && !small,
                ["down-two"]: !drop && !small,
                ["down-three"]: drop && small,
                ["down-four"]: !drop && small,
              })
            ]
          }
        >
          <img src="/expand_more.svg" alt="Down" referrerPolicy="no-referrer" />
        </div>
      </div>
      {drop ? (
        <OptionGroup
          closeOnOptionClick={() => {
            setDrop(false);
          }}
          close={() => {
            setDrop(false);
          }}
          options={options}
          drop={drop}
          top={
            divRef?.current?.getBoundingClientRect().top! +
            window.scrollY +
            divRef?.current?.getBoundingClientRect().height!
          }
          left={divRef?.current?.getBoundingClientRect().left! + window.scrollX}
          width={`${divRef?.current?.getBoundingClientRect().width}px`}
        />
      ) : null}
    </>
  );
}
