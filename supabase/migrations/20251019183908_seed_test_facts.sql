-- Seed Fact 1: Eiffel Tower
WITH new_og_fact AS (
  INSERT INTO public.og_facts (english_text)
  VALUES ('The Eiffel Tower can be 15 cm taller during the summer due to thermal expansion. This means the iron heats up, the particles gain kinetic energy and take up more space.')
  RETURNING id
)
INSERT INTO public.fact_translations (fact_id, language, beginner_text, intermediate_text, advanced_text)
SELECT id, 'Spanish', 'La Torre Eiffel es 15 cm más alta en verano. Esto pasa porque el hierro se calienta y se expande.', 'La Torre Eiffel puede ser 15 cm más alta durante el verano debido a la expansión térmica. Esto significa que el hierro se calienta, las partículas ganan energía y ocupan más espacio.', 'La Torre Eiffel puede incrementar su altura en 15 cm durante el estío debido al fenómeno de expansión térmica. Esto ocurre cuando el hierro se calienta, provocando que sus partículas adquieran mayor energía cinética y ocupen un volumen superior.' FROM new_og_fact;

-- Seed Fact 2: Flamingos
WITH new_og_fact AS (
  INSERT INTO public.og_facts (english_text)
  VALUES ('A group of flamingos is called a "flamboyance." This is a fitting name for these brightly colored and social birds.')
  RETURNING id
)
INSERT INTO public.fact_translations (fact_id, language, beginner_text, intermediate_text, advanced_text)
SELECT id, 'Spanish', 'Un grupo de flamencos se llama "flamboyance". Es un buen nombre para estas aves sociales y de colores brillantes.', 'A un grupo de flamencos se le llama "flamboyance". Este es un nombre apropiado para estas aves sociales y de colores vivos.', 'Una congregación de flamencos es denominada "flamboyance". Es un apelativo adecuado para estas aves gregarias de plumaje vistoso.' FROM new_og_fact;

-- Seed Fact 3: Human Brain
WITH new_og_fact AS (
  INSERT INTO public.og_facts (english_text)
  VALUES ('The human brain takes in 11 million bits of information every second but is aware of only about 40. Our subconscious mind filters out the vast majority of this sensory input.')
  RETURNING id
)
INSERT INTO public.fact_translations (fact_id, language, beginner_text, intermediate_text, advanced_text)
SELECT id, 'Spanish', 'El cerebro humano recibe 11 millones de bits de información por segundo, pero solo nota 40. La mente subconsciente filtra casi toda la información.', 'El cerebro humano procesa 11 millones de bits de información por segundo, pero solo es consciente de unos 40. Nuestra mente subconsciente filtra la gran mayoría de esta entrada sensorial.', 'El cerebro humano asimila 11 millones de bits de información por segundo, aunque solo es consciente de aproximadamente 40. Es nuestra mente subconsciente la que filtra la inmensa mayoría de esta aferencia sensorial.' FROM new_og_fact;

-- Seed Fact 4: Oldest Tree
WITH new_og_fact AS (
  INSERT INTO public.og_facts (english_text)
  VALUES ('The oldest known living organism is a bristlecone pine tree named Methuselah, located in California. It is estimated to be over 4,850 years old.')
  RETURNING id
)
INSERT INTO public.fact_translations (fact_id, language, beginner_text, intermediate_text, advanced_text)
SELECT id, 'Spanish', 'El ser vivo más antiguo es un pino llamado Matusalén, en California. Tiene más de 4,850 años.', 'El organismo vivo más antiguo conocido es un pino de bristlecone llamado Matusalén, ubicado en California. Se estima que tiene más de 4,850 años.', 'El organismo vivo conocido más longevo es un pino bristlecone denominado Matusalén, localizado en California. Su edad se estima en más de 4,850 años.' FROM new_og_fact;

-- Seed Fact 5: Octopuses
WITH new_og_fact AS (
  INSERT INTO public.og_facts (english_text)
  VALUES ('Octopuses have three hearts and blue blood. Two hearts pump blood through the gills, while the third circulates it to the rest of the body.')
  RETURNING id
)
INSERT INTO public.fact_translations (fact_id, language, beginner_text, intermediate_text, advanced_text)
SELECT id, 'Spanish', 'Los pulpos tienen tres corazones y sangre azul. Dos corazones bombean sangre a las branquias y el tercero al resto del cuerpo.', 'Los pulpos tienen tres corazones y sangre azul. Dos corazones bombean la sangre a través de las branquias, mientras que el tercero la circula al resto del cuerpo.', 'Los pulpos poseen tres corazones y su sangre es de color azul. Dos de los corazones se encargan de bombear sangre a través de las branquias, mientras que el tercero la distribuye al resto del organismo.' FROM new_og_fact;

-- Seed Fact 6: Scotland's Unicorn
WITH new_og_fact AS (
  INSERT INTO public.og_facts (english_text)
  VALUES ('The unicorn is the national animal of Scotland. It was chosen for its association with purity, innocence, and power in Celtic mythology.')
  RETURNING id
)
INSERT INTO public.fact_translations (fact_id, language, beginner_text, intermediate_text, advanced_text)
SELECT id, 'Spanish', 'El unicornio es el animal nacional de Escocia. Fue elegido por ser un símbolo de pureza y poder para los celtas.', 'El unicornio es el animal nacional de Escocia. Fue elegido por su asociación con la pureza, la inocencia y el poder en la mitología celta.', 'El unicornio ostenta el título de animal nacional de Escocia. Fue seleccionado por su vinculación con la pureza, la inocencia y el poder en la mitología celta.' FROM new_og_fact;

-- Seed Fact 7: Cloud Weight
WITH new_og_fact AS (
  INSERT INTO public.og_facts (english_text)
  VALUES ('A single cloud can weigh more than a million pounds. This is because the water vapor, while light, is spread over an enormous volume.')
  RETURNING id
)
INSERT INTO public.fact_translations (fact_id, language, beginner_text, intermediate_text, advanced_text)
SELECT id, 'Spanish', 'Una sola nube puede pesar más de un millón de libras. Esto es porque el vapor de agua se extiende en un área muy grande.', 'Una sola nube puede pesar más de un millón de libras. Esto se debe a que el vapor de agua, aunque ligero, se distribuye en un volumen enorme.', 'Una única nube puede llegar a pesar más de un millón de libras. Esto se explica porque el vapor de agua, si bien es ligero, se encuentra disperso en un volumen inmenso.' FROM new_og_fact;

-- Seed Fact 8: Pringles Can
WITH new_og_fact AS (
  INSERT INTO public.og_facts (english_text)
  VALUES ('The inventor of the Pringles can is now buried in one. Fredric Baur, a chemist for Procter & Gamble, was so proud of his creation that his family honored his wish.')
  RETURNING id
)
INSERT INTO public.fact_translations (fact_id, language, beginner_text, intermediate_text, advanced_text)
SELECT id, 'Spanish', 'El inventor de la lata de Pringles está enterrado en una. Estaba tan orgulloso de su creación que su familia cumplió su deseo.', 'El inventor de la lata de Pringles ahora está enterrado en una. Fredric Baur, un químico, estaba tan orgulloso de su creación que su familia cumplió su deseo.', 'El inventor del envase de Pringles yace sepultado en uno. Fredric Baur, químico de Procter & Gamble, estaba tan orgulloso de su creación que su familia honró su último deseo.' FROM new_og_fact;

-- Seed Fact 9: Trees vs Stars
WITH new_og_fact AS (
  INSERT INTO public.og_facts (english_text)
  VALUES ('There are more trees on Earth than stars in the Milky Way galaxy. Scientists estimate there are about 3 trillion trees, compared to 100-400 billion stars.')
  RETURNING id
)
INSERT INTO public.fact_translations (fact_id, language, beginner_text, intermediate_text, advanced_text)
SELECT id, 'Spanish', 'Hay más árboles en la Tierra que estrellas en nuestra galaxia. Hay unos 3 billones de árboles y hasta 400 mil millones de estrellas.', 'Hay más árboles en la Tierra que estrellas en la galaxia de la Vía Láctea. Los científicos estiman que hay unos 3 billones de árboles, en comparación con 100-400 mil millones de estrellas.', 'Existen más árboles en la Tierra que estrellas en la Vía Láctea. Los científicos estiman una cifra de aproximadamente 3 billones de árboles, frente a los 100-400 mil millones de estrellas de la galaxia.' FROM new_og_fact;

-- Seed Fact 10: Venus Day
WITH new_og_fact AS (
  INSERT INTO public.og_facts (english_text)
  VALUES ('A day on Venus is longer than a year on Venus. It takes Venus longer to rotate once on its axis than it does to complete one orbit around the Sun.')
  RETURNING id
)
INSERT INTO public.fact_translations (fact_id, language, beginner_text, intermediate_text, advanced_text)
SELECT id, 'Spanish', 'Un día en Venus es más largo que un año en Venus. Venus tarda más en girar sobre sí mismo que en dar una vuelta al Sol.', 'Un día en Venus es más largo que un año en Venus. A Venus le toma más tiempo girar una vez sobre su eje que completar una órbita alrededor del Sol.', 'Un día en Venus tiene una duración mayor que un año venusiano. Esto se debe a que el planeta requiere más tiempo para efectuar una rotación completa sobre su eje que para completar una órbita en torno al Sol.' FROM new_og_fact;

-- Seed Fact 11: Whip Crack
WITH new_og_fact AS (
  INSERT INTO public.og_facts (english_text)
  VALUES ('The sound of a whip cracking is actually a small sonic boom. The tip of the whip moves faster than the speed of sound, creating the sharp noise.')
  RETURNING id
)
INSERT INTO public.fact_translations (fact_id, language, beginner_text, intermediate_text, advanced_text)
SELECT id, 'Spanish', 'El sonido de un látigo es un pequeño boom sónico. La punta del látigo se mueve más rápido que el sonido.', 'El sonido del chasquido de un látigo es en realidad una pequeña explosión sónica. La punta del látigo se mueve más rápido que la velocidad del sonido, creando el ruido agudo.', 'El estallido de un látigo es, en realidad, una pequeña explosión sónica. La punta del látigo se desplaza a una velocidad superior a la del sonido, lo que genera el característico ruido agudo.' FROM new_og_fact;

-- Seed Fact 12: Shrimp Heart
WITH new_og_fact AS (
  INSERT INTO public.og_facts (english_text)
  VALUES ('A shrimp''s heart is in its head. More specifically, it is located in the thorax, which is fused to the head in a structure called the cephalothorax.')
  RETURNING id
)
INSERT INTO public.fact_translations (fact_id, language, beginner_text, intermediate_text, advanced_text)
SELECT id, 'Spanish', 'El corazón de un camarón está en su cabeza. Se encuentra en una parte llamada cefalotórax.', 'El corazón de un camarón está en su cabeza. Más específicamente, se encuentra en el tórax, que está unido a la cabeza.', 'El corazón de un camarón se localiza en su cabeza. Específicamente, se ubica en el tórax, el cual está fusionado con la cabeza en una estructura denominada cefalotórax.' FROM new_og_fact;

-- Seed Fact 13: Hawaiian Alphabet
WITH new_og_fact AS (
  INSERT INTO public.og_facts (english_text)
  VALUES ('The Hawaiian alphabet has only 12 letters. It consists of five vowels (A, E, I, O, U) and seven consonants (H, K, L, M, N, P, W).')
  RETURNING id
)
INSERT INTO public.fact_translations (fact_id, language, beginner_text, intermediate_text, advanced_text)
SELECT id, 'Spanish', 'El alfabeto hawaiano solo tiene 12 letras. Tiene 5 vocales y 7 consonantes.', 'El alfabeto hawaiano tiene solo 12 letras. Consiste en cinco vocales (A, E, I, O, U) y siete consonantes (H, K, L, M, N, P, W).', 'El alfabeto hawaiano se compone únicamente de 12 letras. Consta de cinco vocales (A, E, I, O, U) y siete consonantes (H, K, L, M, N, P, W).' FROM new_og_fact;

-- Seed Fact 14: Green Oranges
WITH new_og_fact AS (
  INSERT INTO public.og_facts (english_text)
  VALUES ('The first oranges weren''t orange. The original oranges from Southeast Asia were a tangerine-pomelo hybrid, and they were actually green.')
  RETURNING id
)
INSERT INTO public.fact_translations (fact_id, language, beginner_text, intermediate_text, advanced_text)
SELECT id, 'Spanish', 'Las primeras naranjas no eran de color naranja. Eran un tipo de mandarina y en realidad eran verdes.', 'Las primeras naranjas no eran de color naranja. Las naranjas originales del sudeste asiático eran un híbrido de mandarina y pomelo, y en realidad eran verdes.', 'Las naranjas primigenias no eran de color anaranjado. Las variedades originales del sudeste asiático eran un híbrido de mandarina y pomelo, y su color era, de hecho, verde.' FROM new_og_fact;

-- Seed Fact 15: Lightning Hotter than Sun
WITH new_og_fact AS (
  INSERT INTO public.og_facts (english_text)
  VALUES ('A bolt of lightning is five times hotter than the surface of the sun. It can reach temperatures of up to 30,000 Kelvin (about 53,540°F).')
  RETURNING id
)
INSERT INTO public.fact_translations (fact_id, language, beginner_text, intermediate_text, advanced_text)
SELECT id, 'Spanish', 'Un rayo es cinco veces más caliente que la superficie del sol. Puede alcanzar temperaturas muy altas.', 'Un rayo es cinco veces más caliente que la superficie del sol. Puede alcanzar temperaturas de hasta 30,000 Kelvin (unos 53,540°F).', 'Un relámpago es cinco veces más caliente que la superficie solar. Puede alcanzar temperaturas de hasta 30,000 Kelvin (aproximadamente 53,540°F).' FROM new_og_fact;

-- Seed Fact 16: Great Wall from Moon
WITH new_og_fact AS (
  INSERT INTO public.og_facts (english_text)
  VALUES ('The Great Wall of China is not visible from the moon with the naked eye. This is a common myth; it''s too narrow and has a similar color to the surrounding terrain.')
  RETURNING id
)
INSERT INTO public.fact_translations (fact_id, language, beginner_text, intermediate_text, advanced_text)
SELECT id, 'Spanish', 'La Gran Muralla China no se ve desde la luna. Es un mito común porque es muy delgada y del mismo color que la tierra.', 'La Gran Muralla China no es visible desde la luna a simple vista. Este es un mito común; es demasiado estrecha y tiene un color similar al terreno circundante.', 'La Gran Muralla China no es visible desde la luna a simple vista. Se trata de un mito popular; es demasiado angosta y posee una coloración similar a la del terreno circundante.' FROM new_og_fact;

-- Seed Fact 17: Jiffy
WITH new_og_fact AS (
  INSERT INTO public.og_facts (english_text)
  VALUES ('A "jiffy" is an actual unit of time. It''s defined as the time it takes for light to travel one centimeter in a vacuum, which is about 33.3 picoseconds.')
  RETURNING id
)
INSERT INTO public.fact_translations (fact_id, language, beginner_text, intermediate_text, advanced_text)
SELECT id, 'Spanish', 'Un "jiffy" es una unidad de tiempo real. Es el tiempo que tarda la luz en viajar un centímetro.', 'Un "jiffy" es una unidad de tiempo real. Se define como el tiempo que tarda la luz en viajar un centímetro en el vacío, que es de unos 33.3 picosegundos.', 'Un "jiffy" es una unidad de tiempo real. Se define como el lapso que le toma a la luz recorrer un centímetro en el vacío, equivalente a unos 33.3 picosegundos.' FROM new_og_fact;

-- Seed Fact 18: Koala Fingerprints
WITH new_og_fact AS (
  INSERT INTO public.og_facts (english_text)
  VALUES ('The fingerprints of a koala are so indistinguishable from humans that they have on occasion been confused at a crime scene. Both have unique ridges and patterns.')
  RETURNING id
)
INSERT INTO public.fact_translations (fact_id, language, beginner_text, intermediate_text, advanced_text)
SELECT id, 'Spanish', 'Las huellas dactilares de un koala son casi iguales a las de los humanos. A veces se han confundido en escenas de crímenes.', 'Las huellas dactilares de un koala son tan indistinguibles de las de los humanos que en ocasiones han sido confundidas en una escena del crimen. Ambas tienen crestas y patrones únicos.', 'Las huellas dactilares de un koala son tan indiscernibles de las humanas que en ocasiones han generado confusión en la escena de un crimen. Ambas poseen crestas y patrones únicos.' FROM new_og_fact;

-- Seed Fact 19: Immortal Jellyfish
WITH new_og_fact AS (
  INSERT INTO public.og_facts (english_text)
  VALUES ('There is a species of jellyfish that is considered biologically immortal. The Turritopsis dohrnii can revert back to its juvenile polyp stage after reaching maturity, effectively starting its life cycle over.')
  RETURNING id
)
INSERT INTO public.fact_translations (fact_id, language, beginner_text, intermediate_text, advanced_text)
SELECT id, 'Spanish', 'Hay una medusa que es inmortal. Puede volver a ser joven después de madurar y empezar su vida de nuevo.', 'Existe una especie de medusa que se considera biológicamente inmortal. La Turritopsis dohrnii puede revertir a su etapa de pólipo juvenil después de alcanzar la madurez, reiniciando efectivamente su ciclo de vida.', 'Existe una especie de medusa considerada biológicamente inmortal. La Turritopsis dohrnii tiene la capacidad de revertir a su estado de pólipo juvenil tras alcanzar la madurez, reiniciando así su ciclo vital de manera efectiva.' FROM new_og_fact;

-- Seed Fact 20: Blue Whale Heart
WITH new_og_fact AS (
  INSERT INTO public.og_facts (english_text)
  VALUES ('The heart of a blue whale is so large that a human could swim through its arteries. It weighs about 400 pounds and is the largest heart of any animal.')
  RETURNING id
)
INSERT INTO public.fact_translations (fact_id, language, beginner_text, intermediate_text, advanced_text)
SELECT id, 'Spanish', 'El corazón de una ballena azul es tan grande que una persona podría nadar por sus arterias. Pesa unas 400 libras.', 'El corazón de una ballena azul es tan grande que un humano podría nadar a través de sus arterias. Pesa alrededor de 400 libras y es el corazón más grande de cualquier animal.', 'El corazón de una ballena azul es de tal magnitud que un ser humano podría nadar por sus arterias. Pesa aproximadamente 400 libras y es el corazón más grande del reino animal.' FROM new_og_fact;