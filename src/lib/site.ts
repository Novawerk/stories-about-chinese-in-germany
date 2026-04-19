export const site = {
  title: '德华故事集',
  subtitle: 'Stories About Chinese in Germany',
  description:
    '一个关于在德国生活的华人的故事合集——记录创业、职场、生活里那些不太想被忘掉的片刻。',
  domain: 'stories.novawerk.io',
  repo: 'https://github.com/Novawerk/stories-about-chinese-in-germany',
  issueNewStory:
    'https://github.com/Novawerk/stories-about-chinese-in-germany/issues/new?template=new-story.yml',
  license: 'CC BY-NC-SA 4.0',
} as const;

export function githubEditUrl(sourcePath: string): string {
  return `${site.repo}/edit/main/${encodeURI(sourcePath)}`;
}
