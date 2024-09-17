"use client";
import React, { useState, useEffect } from "react";
import {
  FaPlay,
  FaPause,
  FaStepForward,
  FaStepBackward,
  FaVolumeUp,
  FaHeart,
  FaShareAlt,
  FaSearch,
  FaRandom,
  FaRedo,
  FaMusic,
} from "react-icons/fa";

const MusicApp = () => {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [searchQuery, setSearchQuery] = useState("");
  const [playlist, setPlaylist] = useState([]);
  const [showLyrics, setShowLyrics] = useState(false);
  const ziavt =
    "https://images-ext-1.discordapp.net/external/8SF_9ZfRtB-4fWvjzadzM8IYUnpxnx8dYEczyoC04rw/%3Fsize%3D1024/https/cdn.discordapp.com/avatars/891275176409460746/8e481d406a16fe31baef245bfe086a81.webp?format=webp&width=701&height=701";
  const zibot =
    "https://images-ext-1.discordapp.net/external/XGwq-EZsJ5mtxEU5-H0jSyDObe-WcJNHRHWyAElPRSg/%3Fsize%3D1024/https/cdn.discordapp.com/avatars/1005716197259612193/a_a5edfffd377c12de479af9139b26eb5d.gif?width=449&height=449";

  const dummyTracks = [
    {
      id: 1,
      title: "Summer Vibes",
      artist: "Chill Beats",
      album: "Relaxation",
      cover: ziavt,
      lyrics:
        "Verse 1:\nSun-kissed days and starry nights\nWarm breeze whispers, everything's alright\nSandy toes and salty air\nSummer vibes are everywhere\n\nChorus:\nOh, summer vibes\nRiding the waves of good times\nSummer vibes\nMaking memories that shine\n\nVerse 2:\nBBQ smoke and laughter loud\nFriends and family, a joyful crowd\nIce cream melts, fireflies glow\nSummer's magic in full flow\n\n(Repeat Chorus)\n\nBridge:\nLet's make this moment last\nHold onto summer, make it past\nThese golden days, this perfect haze\nForever in our hearts, always\n\n(Repeat Chorus)\n\nOutro:\nSummer vibes, oh summer vibes\nWe're alive with summer vibes",
    },
    {
      id: 2,
      title: "Neon Lights",
      artist: "Electro Pulse",
      album: "Synthwave",
      cover: zibot,
      lyrics:
        "Verse 1:\nCity streets bathed in electric glow\nNeon signs put on a show\nSynthesizers set the mood\nRetro future attitude\n\nChorus:\nNeon lights, neon lights\nIlluminate our wildest nights\nNeon lights, neon lights\nPainting dreams in technicolor bright\n\nVerse 2:\nCyberpunk vision come alive\nDigital love helps us survive\nPixelated heart beats fast\nIn a world that's unsurpassed\n\n(Repeat Chorus)\n\nBridge:\nWe're living in a neon dream\nNothing's ever as it seems\nVirtual reality's our home\nIn this chrome and LED zone\n\n(Repeat Chorus)\n\nOutro:\nAs dawn breaks, the lights fade away\nBut in our minds, they'll always stay\nNeon lights, forever bright\nGuiding us through the night",
    },
    {
      id: 3,
      title: "Acoustic Dreams",
      artist: "Strings & Wood",
      album: "Unplugged",
      cover: zibot,
      lyrics:
        "Verse 1:\nGentle strums on wooden strings\nMelodies that make hearts sing\nFinger-picked notes float on air\nAcoustic dreams beyond compare\n\nChorus:\nAcoustic dreams, so pure and true\nSix strings weaving stories new\nAcoustic dreams, in major and minor\nEmotions laid bare, nothing finer\n\nVerse 2:\nUnplugged and raw, no frills attached\nAuthenticity unmatched\nVoices blend with guitar's tone\nCreating worlds all of their own\n\n(Repeat Chorus)\n\nBridge:\nFrom coffee shops to concert halls\nThese acoustic dreams enthrall\nStripped-down songs touch the soul\nMaking broken spirits whole\n\n(Repeat Chorus)\n\nOutro:\nAs the last note fades away\nAcoustic dreams are here to stay\nIn our hearts, they'll always be\nA soundtrack to eternity",
    },
    {
      id: 4,
      title: "Acoustic Dreams",
      artist: "Strings & Wood",
      album: "Unplugged",
      cover: ziavt,
      lyrics:
        "Verse 1:\nGentle strums on wooden strings\nMelodies that make hearts sing\nFinger-picked notes float on air\nAcoustic dreams beyond compare\n\nChorus:\nAcoustic dreams, so pure and true\nSix strings weaving stories new\nAcoustic dreams, in major and minor\nEmotions laid bare, nothing finer\n\nVerse 2:\nUnplugged and raw, no frills attached\nAuthenticity unmatched\nVoices blend with guitar's tone\nCreating worlds all of their own\n\n(Repeat Chorus)\n\nBridge:\nFrom coffee shops to concert halls\nThese acoustic dreams enthrall\nStripped-down songs touch the soul\nMaking broken spirits whole\n\n(Repeat Chorus)\n\nOutro:\nAs the last note fades away\nAcoustic dreams are here to stay\nIn our hearts, they'll always be\nA soundtrack to eternity",
    },
    {
      id: 5,
      title: "Acoustic Dreams",
      artist: "Strings & Wood",
      album: "Unplugged",
      cover: zibot,
      lyrics:
        "Verse 1:\nGentle strums on wooden strings\nMelodies that make hearts sing\nFinger-picked notes float on air\nAcoustic dreams beyond compare\n\nChorus:\nAcoustic dreams, so pure and true\nSix strings weaving stories new\nAcoustic dreams, in major and minor\nEmotions laid bare, nothing finer\n\nVerse 2:\nUnplugged and raw, no frills attached\nAuthenticity unmatched\nVoices blend with guitar's tone\nCreating worlds all of their own\n\n(Repeat Chorus)\n\nBridge:\nFrom coffee shops to concert halls\nThese acoustic dreams enthrall\nStripped-down songs touch the soul\nMaking broken spirits whole\n\n(Repeat Chorus)\n\nOutro:\nAs the last note fades away\nAcoustic dreams are here to stay\nIn our hearts, they'll always be\nA soundtrack to eternity",
    },
    {
      id: 1,
      title: "Summer Vibes",
      artist: "Chill Beats",
      album: "Relaxation",
      cover: ziavt,
      lyrics:
        "Verse 1:\nSun-kissed days and starry nights\nWarm breeze whispers, everything's alright\nSandy toes and salty air\nSummer vibes are everywhere\n\nChorus:\nOh, summer vibes\nRiding the waves of good times\nSummer vibes\nMaking memories that shine\n\nVerse 2:\nBBQ smoke and laughter loud\nFriends and family, a joyful crowd\nIce cream melts, fireflies glow\nSummer's magic in full flow\n\n(Repeat Chorus)\n\nBridge:\nLet's make this moment last\nHold onto summer, make it past\nThese golden days, this perfect haze\nForever in our hearts, always\n\n(Repeat Chorus)\n\nOutro:\nSummer vibes, oh summer vibes\nWe're alive with summer vibes",
    },
    {
      id: 2,
      title: "Neon Lights",
      artist: "Electro Pulse",
      album: "Synthwave",
      cover: zibot,
      lyrics:
        "Verse 1:\nCity streets bathed in electric glow\nNeon signs put on a show\nSynthesizers set the mood\nRetro future attitude\n\nChorus:\nNeon lights, neon lights\nIlluminate our wildest nights\nNeon lights, neon lights\nPainting dreams in technicolor bright\n\nVerse 2:\nCyberpunk vision come alive\nDigital love helps us survive\nPixelated heart beats fast\nIn a world that's unsurpassed\n\n(Repeat Chorus)\n\nBridge:\nWe're living in a neon dream\nNothing's ever as it seems\nVirtual reality's our home\nIn this chrome and LED zone\n\n(Repeat Chorus)\n\nOutro:\nAs dawn breaks, the lights fade away\nBut in our minds, they'll always stay\nNeon lights, forever bright\nGuiding us through the night",
    },
    {
      id: 3,
      title: "Acoustic Dreams",
      artist: "Strings & Wood",
      album: "Unplugged",
      cover: zibot,
      lyrics:
        "Verse 1:\nGentle strums on wooden strings\nMelodies that make hearts sing\nFinger-picked notes float on air\nAcoustic dreams beyond compare\n\nChorus:\nAcoustic dreams, so pure and true\nSix strings weaving stories new\nAcoustic dreams, in major and minor\nEmotions laid bare, nothing finer\n\nVerse 2:\nUnplugged and raw, no frills attached\nAuthenticity unmatched\nVoices blend with guitar's tone\nCreating worlds all of their own\n\n(Repeat Chorus)\n\nBridge:\nFrom coffee shops to concert halls\nThese acoustic dreams enthrall\nStripped-down songs touch the soul\nMaking broken spirits whole\n\n(Repeat Chorus)\n\nOutro:\nAs the last note fades away\nAcoustic dreams are here to stay\nIn our hearts, they'll always be\nA soundtrack to eternity",
    },
    {
      id: 4,
      title: "Acoustic Dreams",
      artist: "Strings & Wood",
      album: "Unplugged",
      cover: ziavt,
      lyrics:
        "Verse 1:\nGentle strums on wooden strings\nMelodies that make hearts sing\nFinger-picked notes float on air\nAcoustic dreams beyond compare\n\nChorus:\nAcoustic dreams, so pure and true\nSix strings weaving stories new\nAcoustic dreams, in major and minor\nEmotions laid bare, nothing finer\n\nVerse 2:\nUnplugged and raw, no frills attached\nAuthenticity unmatched\nVoices blend with guitar's tone\nCreating worlds all of their own\n\n(Repeat Chorus)\n\nBridge:\nFrom coffee shops to concert halls\nThese acoustic dreams enthrall\nStripped-down songs touch the soul\nMaking broken spirits whole\n\n(Repeat Chorus)\n\nOutro:\nAs the last note fades away\nAcoustic dreams are here to stay\nIn our hearts, they'll always be\nA soundtrack to eternity",
    },
    {
      id: 5,
      title: "Acoustic Dreams",
      artist: "Strings & Wood",
      album: "Unplugged",
      cover: zibot,
      lyrics:
        "Verse 1:\nGentle strums on wooden strings\nMelodies that make hearts sing\nFinger-picked notes float on air\nAcoustic dreams beyond compare\n\nChorus:\nAcoustic dreams, so pure and true\nSix strings weaving stories new\nAcoustic dreams, in major and minor\nEmotions laid bare, nothing finer\n\nVerse 2:\nUnplugged and raw, no frills attached\nAuthenticity unmatched\nVoices blend with guitar's tone\nCreating worlds all of their own\n\n(Repeat Chorus)\n\nBridge:\nFrom coffee shops to concert halls\nThese acoustic dreams enthrall\nStripped-down songs touch the soul\nMaking broken spirits whole\n\n(Repeat Chorus)\n\nOutro:\nAs the last note fades away\nAcoustic dreams are here to stay\nIn our hearts, they'll always be\nA soundtrack to eternity",
    },
    {
      id: 1,
      title: "Summer Vibes",
      artist: "Chill Beats",
      album: "Relaxation",
      cover: ziavt,
      lyrics:
        "Verse 1:\nSun-kissed days and starry nights\nWarm breeze whispers, everything's alright\nSandy toes and salty air\nSummer vibes are everywhere\n\nChorus:\nOh, summer vibes\nRiding the waves of good times\nSummer vibes\nMaking memories that shine\n\nVerse 2:\nBBQ smoke and laughter loud\nFriends and family, a joyful crowd\nIce cream melts, fireflies glow\nSummer's magic in full flow\n\n(Repeat Chorus)\n\nBridge:\nLet's make this moment last\nHold onto summer, make it past\nThese golden days, this perfect haze\nForever in our hearts, always\n\n(Repeat Chorus)\n\nOutro:\nSummer vibes, oh summer vibes\nWe're alive with summer vibes",
    },
    {
      id: 2,
      title: "Neon Lights",
      artist: "Electro Pulse",
      album: "Synthwave",
      cover: zibot,
      lyrics:
        "Verse 1:\nCity streets bathed in electric glow\nNeon signs put on a show\nSynthesizers set the mood\nRetro future attitude\n\nChorus:\nNeon lights, neon lights\nIlluminate our wildest nights\nNeon lights, neon lights\nPainting dreams in technicolor bright\n\nVerse 2:\nCyberpunk vision come alive\nDigital love helps us survive\nPixelated heart beats fast\nIn a world that's unsurpassed\n\n(Repeat Chorus)\n\nBridge:\nWe're living in a neon dream\nNothing's ever as it seems\nVirtual reality's our home\nIn this chrome and LED zone\n\n(Repeat Chorus)\n\nOutro:\nAs dawn breaks, the lights fade away\nBut in our minds, they'll always stay\nNeon lights, forever bright\nGuiding us through the night",
    },
    {
      id: 3,
      title: "Acoustic Dreams",
      artist: "Strings & Wood",
      album: "Unplugged",
      cover: zibot,
      lyrics:
        "Verse 1:\nGentle strums on wooden strings\nMelodies that make hearts sing\nFinger-picked notes float on air\nAcoustic dreams beyond compare\n\nChorus:\nAcoustic dreams, so pure and true\nSix strings weaving stories new\nAcoustic dreams, in major and minor\nEmotions laid bare, nothing finer\n\nVerse 2:\nUnplugged and raw, no frills attached\nAuthenticity unmatched\nVoices blend with guitar's tone\nCreating worlds all of their own\n\n(Repeat Chorus)\n\nBridge:\nFrom coffee shops to concert halls\nThese acoustic dreams enthrall\nStripped-down songs touch the soul\nMaking broken spirits whole\n\n(Repeat Chorus)\n\nOutro:\nAs the last note fades away\nAcoustic dreams are here to stay\nIn our hearts, they'll always be\nA soundtrack to eternity",
    },
    {
      id: 4,
      title: "Acoustic Dreams",
      artist: "Strings & Wood",
      album: "Unplugged",
      cover: ziavt,
      lyrics:
        "Verse 1:\nGentle strums on wooden strings\nMelodies that make hearts sing\nFinger-picked notes float on air\nAcoustic dreams beyond compare\n\nChorus:\nAcoustic dreams, so pure and true\nSix strings weaving stories new\nAcoustic dreams, in major and minor\nEmotions laid bare, nothing finer\n\nVerse 2:\nUnplugged and raw, no frills attached\nAuthenticity unmatched\nVoices blend with guitar's tone\nCreating worlds all of their own\n\n(Repeat Chorus)\n\nBridge:\nFrom coffee shops to concert halls\nThese acoustic dreams enthrall\nStripped-down songs touch the soul\nMaking broken spirits whole\n\n(Repeat Chorus)\n\nOutro:\nAs the last note fades away\nAcoustic dreams are here to stay\nIn our hearts, they'll always be\nA soundtrack to eternity",
    },
    {
      id: 5,
      title: "Acoustic Dreams",
      artist: "Strings & Wood",
      album: "Unplugged",
      cover: zibot,
      lyrics:
        "Verse 1:\nGentle strums on wooden strings\nMelodies that make hearts sing\nFinger-picked notes float on air\nAcoustic dreams beyond compare\n\nChorus:\nAcoustic dreams, so pure and true\nSix strings weaving stories new\nAcoustic dreams, in major and minor\nEmotions laid bare, nothing finer\n\nVerse 2:\nUnplugged and raw, no frills attached\nAuthenticity unmatched\nVoices blend with guitar's tone\nCreating worlds all of their own\n\n(Repeat Chorus)\n\nBridge:\nFrom coffee shops to concert halls\nThese acoustic dreams enthrall\nStripped-down songs touch the soul\nMaking broken spirits whole\n\n(Repeat Chorus)\n\nOutro:\nAs the last note fades away\nAcoustic dreams are here to stay\nIn our hearts, they'll always be\nA soundtrack to eternity",
    },
  ];

  useEffect(() => {
    setCurrentTrack(dummyTracks[0]);
    setPlaylist(dummyTracks);
  }, []);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const handleVolumeChange = (e) => setVolume(e.target.value);

  const handleSearch = (e) => setSearchQuery(e.target.value);

  const toggleLyrics = () => setShowLyrics(!showLyrics);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 flex flex-col">
      {/* <header className="bg-indigo-600 text-white p-4">
        <h1 className="text-2xl font-bold">Music Web App</h1>
      </header> */}

      <main className="flex-grow flex flex-col md:flex-row p-4 gap-4">
        <section className="w-full md:w-2/3 bg-white rounded-lg shadow-lg p-6">
          <div className="mb-6 relative">
            <input
              type="text"
              placeholder="Search for music..."
              className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              value={searchQuery}
              onChange={handleSearch}
            />
            <FaSearch className="absolute top-3 right-3 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold mb-4">Queue</h2>
          <div className="max-h-[630px] overflow-y-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {playlist.map((track) => (
                <div
                  key={track.id}
                  className="bg-gray-50 rounded-lg overflow-hidden shadow-md"
                >
                  <img
                    src={track.cover}
                    alt={track.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold">{track.title}</h3>
                    <p className="text-sm text-gray-600">{track.artist}</p>
                    <div className="mt-2 flex justify-between items-center">
                      <button className="text-indigo-600 hover:text-indigo-800">
                        <FaPlay />
                      </button>
                      <div>
                        <button className="text-gray-600 hover:text-gray-800 mr-2">
                          <FaHeart />
                        </button>
                        <button className="text-gray-600 hover:text-gray-800">
                          <FaShareAlt />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <aside className="w-full md:w-1/3 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Now Playing</h2>
          {currentTrack && (
            <div className="text-center">
              <img
                src={currentTrack.cover}
                alt={currentTrack.title}
                className="w-full h-64 object-cover rounded-lg mb-4"
              />
              <h3 className="text-lg font-semibold">{currentTrack.title}</h3>
              <p className="text-gray-600">{currentTrack.artist}</p>
              <p className="text-sm text-gray-500 mb-4">{currentTrack.album}</p>
              <div className="flex justify-center items-center space-x-4 mb-4">
                <button className="text-gray-600 hover:text-gray-800">
                  <FaStepBackward />
                </button>
                <button
                  className="text-indigo-600 hover:text-indigo-800 text-3xl"
                  onClick={togglePlay}
                >
                  {isPlaying ? <FaPause /> : <FaPlay />}
                </button>
                <button className="text-gray-600 hover:text-gray-800">
                  <FaStepForward />
                </button>
              </div>
              <div className="flex items-center mb-4">
                <FaVolumeUp className="text-gray-600 mr-2" />
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-full"
                />
              </div>
              <div className="mt-4 flex justify-center space-x-4">
                <button className="text-gray-600 hover:text-gray-800">
                  <FaRandom />
                </button>
                <button className="text-gray-600 hover:text-gray-800">
                  <FaRedo />
                </button>
                <button
                  className="text-gray-600 hover:text-gray-800"
                  onClick={toggleLyrics}
                >
                  <FaMusic />
                </button>
              </div>
              {showLyrics && (
                <div className="mt-6 bg-gray-50 p-4 rounded-lg max-h-64 overflow-y-auto">
                  <h4 className="font-semibold mb-2">Lyrics</h4>
                  <p className="whitespace-pre-line text-sm text-gray-700">
                    {currentTrack.lyrics}
                  </p>
                </div>
              )}
            </div>
          )}
        </aside>
      </main>

      <footer className="bg-gray-200 text-center p-4 mt-auto">
        <p>&copy; 2099 Music Web App. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default MusicApp;
