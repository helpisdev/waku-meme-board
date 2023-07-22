import * as Form from "@radix-ui/react-form";
import { addMemeToHelia } from "@stores/helia";
import {
  uploadMeme,
  isAcceptedMemeFormatMime,
  mimeToFormatMapping,
} from "@stores/waku";

async function handleMemeSubmit(
  e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
) {
  e.preventDefault();
  const meme: HTMLElement | null = document.getElementById("meme");
  if (meme) {
    const memes = (meme as HTMLInputElement).files;
    if (memes) {
      for (const m of memes) {
        const memeData = new Uint8Array(await m.arrayBuffer());
        const cid = await addMemeToHelia(memeData);
        if (cid) {
          const mime = m.type;
          if (isAcceptedMemeFormatMime(mime)) {
            await uploadMeme(cid.toString(), mimeToFormatMapping[mime]);
          }
        }
      }
    }
  }
}

export const MemeUploader = () => (
  <Form.Root className="mx-auto block max-w-sm border-2 border-subtle-borders-and-seperators dark:border-subtle-borders-and-seperators-dark rounded-lg bg-app dark:bg-app-dark p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)]">
    <Form.Field className="" name="meme">
      <div className="mb-3">
        <Form.Label className="mb-2 inline-block text-high-contrast dark:text-high-contrast-dark">
          Choose an image:
        </Form.Label>
        <Form.Message match="valueMissing">Please select an image</Form.Message>
        <Form.Message match="typeMismatch">
          Please select an image with a format of jpeg, jpg, png, or gif
        </Form.Message>
      </div>
      <Form.Control asChild>
        <input
          className="relative
                      m-0
                      block
                      w-full
                      min-w-0
                      flex-auto
                      rounded
                      border
                      border-solid
                      bg-clip-padding
                      px-3
                      py-[0.32rem]
                      text-base
                      font-normal
                      transition
                      duration-300
                      ease-in-out
                      file:-mx-3
                      file:-my-[0.32rem]
                      file:overflow-hidden
                      file:rounded-none
                      file:border-0
                      file:border-solid
                      file:border-inherit
                      file:px-3
                      file:py-[0.32rem]
                      file:transition
                      file:duration-150
                      file:ease-in-out
                      file:[border-inline-end-width:1px]
                      file:[margin-inline-end:0.75rem]
                      focus:border-primary
                      focus:shadow-te-primary
                      focus:outline-none
                      dark:focus:border-primary

                      text-high-contrast
                      focus:text-high-contrast
                      file:text-high-contrast
                      file:bg-ui-el
                      hover:file:bg-hovered-ui-el
                      border-ui-el-borders-and-focus-rings

                      dark:border-ui-el-borders-and-focus-rings-dark
                      dark:text-high-contrast-dark
                      focus:dark:text-high-contrast-dark
                      dark:file:text-high-contrast-dark
                      dark:file:bg-ui-el-dark
                      hover:dark:file:bg-hovered-ui-el-dark
"
          type="file"
          accept=".jpg, .png, .jpeg, .gif"
          id="meme"
          required
        />
      </Form.Control>
    </Form.Field>
    <Form.Submit asChild>
      <button
        type="submit"
        onClick={handleMemeSubmit}
        className="
        mt-2
        dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]]
        inline-block
        w-full
        rounded
        bg-solid
        dark:bg-solid-dark
        px-6
        pb-2
        pt-2.5
        text-lg
        font-medium
        leading-normal
        text-high-contrast
        dark:text-high-contrast-dark
        shadow-[0_4px_9px_-4px_#3b71ca]
        transition
        duration-150
        ease-in-out
        hover:bg-hovered-solid
        dark:hover:bg-hovered-solid-dark
        hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)]
        focus:bg-hovered-solid
        dark:focus:bg-hovered-solid-dark
        focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)]
        focus:outline-none
        focus:ring-0
        active:bg-hovered-solid
        dark:active:bg-hovered-solid-dark
        active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)]
        dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)]
        dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]
        dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]
        "
        data-te-ripple-init
        data-te-ripple-color="light"
      >
        Post a Meme!
      </button>
    </Form.Submit>
  </Form.Root>
);
