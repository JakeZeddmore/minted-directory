export function useDirectory() {
  const intersection = useAppConfig().directory.search.tags.intersection;

  const search: Ref<string> = useState("search");
  const tags: Ref<string[]> = useState("tags");

  const directoryData = useAsyncData(
    "board",
    () => {
      const query = queryContent("/board");

      if (search.value) {
        query.where({
          $or: [
            { title: { $icontains: search.value } },
            { description: { $icontains: search.value } },
          ],
        });
      }

      if (tags.value && tags.value.length > 0) {
        query.where({
          tags: intersection
            ? { $contains: tags.value }
            : { $containsAny: tags.value },
        });
      }

      return query.sort({ sponsored: 1 }).find();
    },
    { watch: [search, tags] }
  );

  watch(
    [search, tags],
    () => {
      refresh();
    },
    { deep: true }
  );

  return directoryData;
}
