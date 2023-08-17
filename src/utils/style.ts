const colorRandomizerFactory = () => {
  const colorShades = [
    'gray',
    'red',
    'yellow',
    'green',
    'blue',
    'indigo',
    'purple',
    'pink',
    'teal',
    'cyan',
  ];

  const shadeVariants = ['500', '600', '700', '800', '900'];

  const allColorShades = colorShades.flatMap((color) =>
    shadeVariants.map((shade) => `${color}-${shade}`)
  );

  return () => {
    const index = Math.floor(Math.random() * allColorShades.length);

    return allColorShades[index];
  };
};

const colorRandomizer = colorRandomizerFactory();

export { colorRandomizer };
