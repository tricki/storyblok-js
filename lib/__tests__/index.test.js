import { getLog } from "jest-console";
import {
  storyblokInit,
  apiPlugin,
  storyblokEditable,
  renderRichText,
} from "@storyblok/js";

import richTextFixture from "../fixtures/richTextObject.json";

describe("@storyblok/js", () => {
  describe("Api", () => {
    it("Is not loaded by default", () => {
      const result = storyblokInit({
        accessToken: "wANpEQEsMYGOwLxwXQ76Ggtt",
      });

      expect(result).toEqual({});
    });

    it("Is loaded correctly when using the apiPlugin", async () => {
      const { storyblokApi } = storyblokInit({
        accessToken: "wANpEQEsMYGOwLxwXQ76Ggtt",
        use: [apiPlugin],
      });

      const result = await storyblokApi.getAll("cdn/stories");

      expect(result.length).toBeGreaterThan(0);
    });

    it("Logs an error if no access token is provided", () => {
      storyblokInit({
        accessToken: null,
        apiOptions: { accessToken: null },
        use: [apiPlugin],
      });

      expect(getLog().logs).toEqual([
        [
          "error",
          "You need to provide an access token to interact with Storyblok API. Read https://www.storyblok.com/docs/api/content-delivery#topics/authentication",
        ],
      ]);
    });
  });

  describe("Editable", () => {
    it("Gets data-blok-c and data-blok-uid", async () => {
      const { storyblokApi } = storyblokInit({
        accessToken: "wANpEQEsMYGOwLxwXQ76Ggtt",
        use: [apiPlugin],
      });

      const { data } = await storyblokApi.get("cdn/stories/demo");

      let blok = data.story.content;
      blok._editable = `<!--#storyblok#{"id":${data.story.id},"uid":"${data.story.uid}"}-->`;

      const editableResult = storyblokEditable(blok);

      expect(editableResult["data-blok-c"]).toBeDefined();
      expect(editableResult["data-blok-uid"]).toBeDefined();
    });
  });

  describe("Rich Text Resolver", () => {
    it("should return the rendered HTML when passing a RichText object", () => {
      storyblokInit({ accessToken: "wANpEQEsMYGOwLxwXQ76Ggtt", bridge: false });
      expect(renderRichText(richTextFixture)).toMatchSnapshot();
    });
    it("should return an empty string and warn in console when it's a falsy value", () => {
      storyblokInit({ accessToken: "wANpEQEsMYGOwLxwXQ76Ggtt", bridge: false });
      expect(renderRichText(null)).toBe("");
      expect(getLog().logs).toMatchSnapshot();
    });
    it("should return an empty string when the value it's an empty string", () => {
      storyblokInit({ accessToken: "wANpEQEsMYGOwLxwXQ76Ggtt", bridge: false });
      expect(renderRichText(null)).toBe("");
    });
  });
});
