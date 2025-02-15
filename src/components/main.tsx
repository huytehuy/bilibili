import { useState } from "react";
import { Input, Button, Card } from "@mantine/core";
import { Download } from "lucide-react";

export default function BilibiliDownloader() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    if (!url) {
      alert("⚠️ Vui lòng nhập URL video");
      return;
    }

    if (!url.includes('bilibili.com')) {
      alert("⚠️ URL không hợp lệ! Vui lòng nhập link từ Bilibili.com");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`http://52.62.131.56:3000/download?url=${encodeURIComponent(url)}`);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Có lỗi xảy ra');
      }

      // Tạo một thẻ a ẩn để tải xuống
      const link = document.createElement('a');
      link.href = `http://52.62.131.56:3000/download?url=${encodeURIComponent(url)}`;
      link.download = 'video.mp4';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Đợi một khoảng thời gian ngắn để đảm bảo việc tải xuống đã bắt đầu
      await new Promise(resolve => setTimeout(resolve, 3000));

    } catch (error) {
      console.error(error);
      alert(`❌ Lỗi: ${error instanceof Error ? error.message : "Không thể tải video, hãy thử lại!"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-violet-100 py-12 px-4">
      <div className="max-w-md mx-auto">
        <Card className="backdrop-blur-sm bg-white/80 shadow-xl rounded-2xl p-6 border border-white/20">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Bilibili Downloader
            </h1>
            <p className="text-gray-600 mt-2">
              Tải video từ Bilibili nhanh chóng và dễ dàng
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <Input
                placeholder="Nhập URL video Bilibili"
                value={url}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUrl(e.target.value)}
                className="focus:ring-2 focus:ring-purple-500"
                styles={{
                  input: {
                    '&:focus': {
                      borderColor: '#8B5CF6',
                    },
                  },
                }}
                size="lg"
              />
            </div>

            <Button
              onClick={handleDownload}
              style={{marginTop: '10px'}}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 
                       transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
              size="lg"
              loading={loading}
            >
              {!loading && <Download className="mr-2 h-5 w-5" />}
              {loading ? 'Đang xử lý...' : 'Tải xuống'}
            </Button>

            <div className="text-center text-sm text-gray-500 mt-4">
              <p>Hỗ trợ tải video từ Bilibili.com</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}