"use client";
import Image from "next/image";
import React,{ useEffect, useRef } from "react";
import io from "socket.io-client"

const socket = io("")//後で調整

function Bus() {
  return (
    <div>
      <Image src="/images/bus.png" alt="バス" width={16} height={16} />
    </div>
  );
}

function Template(id, start, goal, time, crowd, busPosition) {
  const busInfoRef = useRef(null);  // busInfo要素への参照を保持
  
  const handleButtonClick = () => {
    if (busInfoRef.current) {
      // 要素の表示・非表示をトグルする
      busInfoRef.current.style.display =
        busInfoRef.current.style.display === "none" ? "block" : "none";
    }
  };

  const stops_16 = [
    "阪神御影",
    "中御影",
    "御影大手筋",
    "御影公会堂前",
    "徳井",
    "灘区役所前 (桜口)",
    "JR六甲道",
    "六甲口",
    "阪急六甲",
    "楠丘町五丁目",
    "楠丘町三丁目",
    "高羽町",
    "神大国際文化学研究科前",
    "鶴甲南",
    "鶴甲二丁目",
    "鶴甲四丁目",
    "六甲ケーブル下"
  ];

  const stops_36 = [
    "阪神御影",
    "中御影",
    "御影大手筋",
    "御影公会堂前",
    "徳井",
    "灘区役所前 (桜口)",
    "JR六甲道",
    "六甲口",
    "阪急六甲",
    "六甲登山口",
    "六甲台南口",
    "神大文理農学部前",
    "神大本部工学部前",
    "神大正門前",
    "六甲団地前",
    "六甲台",
    "六甲台北",
    "神大人間発達環境学研究科前",
    "鶴甲二丁目",
    "鶴甲三丁目",
    "鶴甲団地"
  ];

  return (
    <div style={{ position: "relative", width: "250px", height: "385px", padding: 0, marginBottom: "20px", backgroundColor: "#efefef", borderRadius: "8px", overflow: "hidden" }}>
      <div style={{ gap: "10px", display: "flex" }}>
        <p>{id}系統</p>
        <p>{start}から{goal}</p>
      </div>
      <div style={{ gap: "20px", display: "flex" }}>
        <p>{time}</p>
        <p>{crowd}</p>
        <button onClick={handleButtonClick}>a</button>
      </div>

      {/* 初期状態でdisplay: "none"にして非表示に */}
      <div ref={busInfoRef} style={{ display: "none" }}>
        <p>{id === 16 && <p>■Next: 16 六甲ケーブル下 行</p>}
        {id === 36 && <p>■Next: 36 鶴甲団地 行</p>}</p>
        <div className="scrollable">
          <div style={{ writingMode: "vertical-lr", textOrientation: "upright", lineHeight: 1.5 }}>
            {(Template.id === 16 ? stops_16 : stops_36).map((stop, index) => (
              <React.Fragment key={index}>
                {/* busPositionの位置にBusコンポーネントを挿入 */}
                {index === busPosition && <Bus />}
                <p>{stop}</p>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  useEffect(() => {
    // サーバーからデータを取得
    socket.emit("requestBusData"); // サーバーにデータリクエスト
    socket.on("busData", (data) => {
      setBusData(data); // 受け取ったデータを状態に保存
    });

    // クリーンアップ
    return () => {
      socket.off("busData");
    };
  }, []);
  return (
  <div style={{ backgroundColor: "#f8f9fa", fontFamily: "'M PLUS 1', sans-serif", margin: 0 }}>
    <link href="https://fonts.googleapis.com/css2?family=M+PLUS+1:wght@500;600;700;900&display=swap" rel="stylesheet"></link> 
    <header>
      <title>SHINDAI Transit info</title>
    </header>
    <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
     <h1 style={{fontSize:"23px"}}>SHINDAI Transit</h1>
     {Template(16,"阪急六甲","高羽町","18:21","かなり",5)}
     {Template(36,"JR六甲道","正門前","18:24","少し",11)}
    </main>
  </div>
  );
}
//    <link href="https://fonts.googleapis.com/css2?family=M+PLUS+1:wght@500;600;700;900&display=swap" rel="stylesheet"></link>はnext.jsのバージョンが14.2.6以前ではエラーが出る