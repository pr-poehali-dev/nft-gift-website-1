import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';

interface NFTItem {
  id: number;
  name: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  image: string;
}

interface CaseType {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  items: NFTItem[];
  probabilities: { rarity: string; chance: number }[];
}

const rarityColors = {
  common: 'bg-gray-500',
  rare: 'bg-blue-500',
  epic: 'bg-purple-500',
  legendary: 'bg-gradient-to-r from-yellow-500 to-amber-600',
};

const rarityLabels = {
  common: 'Обычный',
  rare: 'Редкий',
  epic: 'Эпический',
  legendary: 'Легендарный',
};

const cases: CaseType[] = [
  {
    id: 1,
    name: 'Стартовый кейс',
    price: 99,
    image: '💎',
    description: 'Идеальный выбор для новичков. Содержит базовые NFT с хорошими шансами на редкие предметы.',
    items: [
      { id: 1, name: 'Цифровой артефакт', rarity: 'common', image: '🎨' },
      { id: 2, name: 'Пиксель-арт', rarity: 'rare', image: '🖼️' },
      { id: 3, name: 'Криптокристалл', rarity: 'epic', image: '💠' },
    ],
    probabilities: [
      { rarity: 'Обычный', chance: 70 },
      { rarity: 'Редкий', chance: 25 },
      { rarity: 'Эпический', chance: 5 },
    ],
  },
  {
    id: 2,
    name: 'Премиум кейс',
    price: 299,
    image: '👑',
    description: 'Эксклюзивная коллекция премиум NFT с повышенным шансом на легендарные предметы.',
    items: [
      { id: 4, name: 'Золотой токен', rarity: 'rare', image: '🪙' },
      { id: 5, name: 'Космический камень', rarity: 'epic', image: '🌟' },
      { id: 6, name: 'Легендарный артефакт', rarity: 'legendary', image: '⚡' },
    ],
    probabilities: [
      { rarity: 'Редкий', chance: 50 },
      { rarity: 'Эпический', chance: 35 },
      { rarity: 'Легендарный', chance: 15 },
    ],
  },
  {
    id: 3,
    name: 'VIP кейс',
    price: 999,
    image: '✨',
    description: 'Наивысший уровень роскоши. Гарантированный эпический предмет и высокий шанс на легендарные NFT.',
    items: [
      { id: 7, name: 'Платиновая звезда', rarity: 'epic', image: '⭐' },
      { id: 8, name: 'Алмазная корона', rarity: 'legendary', image: '👑' },
      { id: 9, name: 'Бесконечность', rarity: 'legendary', image: '∞' },
    ],
    probabilities: [
      { rarity: 'Эпический', chance: 60 },
      { rarity: 'Легендарный', chance: 40 },
    ],
  },
];

const Index = () => {
  const [selectedCase, setSelectedCase] = useState<CaseType | null>(null);
  const [isOpening, setIsOpening] = useState(false);
  const [wonItem, setWonItem] = useState<NFTItem | null>(null);
  const [userBalance] = useState(5000);
  const [userInventory, setUserInventory] = useState<NFTItem[]>([
    { id: 10, name: 'Стартовый артефакт', rarity: 'common', image: '🎁' },
  ]);
  const [openHistory, setOpenHistory] = useState<{ item: NFTItem; date: Date }[]>([
    { item: { id: 10, name: 'Стартовый артефакт', rarity: 'common', image: '🎁' }, date: new Date() },
  ]);
  const [rouletteItems, setRouletteItems] = useState<NFTItem[]>([]);
  const [scrollOffset, setScrollOffset] = useState(0);

  const handleOpenCase = (caseData: CaseType) => {
    setIsOpening(true);
    setSelectedCase(caseData);
    setScrollOffset(0);

    const random = Math.random() * 100;
    let cumulativeChance = 0;
    let selectedRarity: 'common' | 'rare' | 'epic' | 'legendary' = 'common';

    for (const prob of caseData.probabilities) {
      cumulativeChance += prob.chance;
      if (random <= cumulativeChance) {
        selectedRarity = prob.rarity.toLowerCase() as any;
        break;
      }
    }

    const possibleItems = caseData.items.filter((item) => item.rarity === selectedRarity);
    const randomItem = possibleItems[Math.floor(Math.random() * possibleItems.length)] || caseData.items[0];

    const allItems = [...caseData.items, ...caseData.items, ...caseData.items];
    const shuffledItems = [];
    for (let i = 0; i < 60; i++) {
      shuffledItems.push(allItems[Math.floor(Math.random() * allItems.length)]);
    }
    shuffledItems[50] = randomItem;
    setRouletteItems(shuffledItems);

    setTimeout(() => {
      setScrollOffset(50 * 152);
    }, 100);

    setTimeout(() => {
      setWonItem(randomItem);
      setUserInventory((prev) => [...prev, randomItem]);
      setOpenHistory((prev) => [{ item: randomItem, date: new Date() }, ...prev]);
      setIsOpening(false);
    }, 7000);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-4xl animate-float">💎</div>
              <h1 className="text-3xl font-bold gold-text">NFT Cases</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-muted px-4 py-2 rounded-lg">
                <Icon name="Wallet" className="text-primary" size={20} />
                <span className="font-semibold gold-text">{userBalance} ₽</span>
              </div>
              <Button variant="outline" className="gap-2">
                <Icon name="User" size={20} />
                Профиль
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="cases" className="space-y-8">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 bg-card">
            <TabsTrigger value="cases" className="gap-2">
              <Icon name="Box" size={18} />
              Каталог кейсов
            </TabsTrigger>
            <TabsTrigger value="profile" className="gap-2">
              <Icon name="User" size={18} />
              Личный кабинет
            </TabsTrigger>
          </TabsList>

          <TabsContent value="cases" className="space-y-8 animate-fade-in">
            <div className="text-center space-y-4">
              <h2 className="text-5xl font-bold gold-text">Откройте свой кейс</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Выберите кейс и получите шанс на эксклюзивные NFT. Чем выше уровень кейса, тем больше шанс на редкие предметы.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cases.map((caseData) => (
                <Card
                  key={caseData.id}
                  className="bg-card border-border hover:border-primary transition-all duration-300 overflow-hidden group hover:glow-gold animate-scale-in"
                >
                  <CardHeader className="text-center space-y-4">
                    <div className="text-7xl mx-auto animate-float group-hover:scale-110 transition-transform">
                      {caseData.image}
                    </div>
                    <div>
                      <CardTitle className="text-2xl mb-2">{caseData.name}</CardTitle>
                      <CardDescription className="text-base">{caseData.description}</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Вероятности выпадения:</p>
                      {caseData.probabilities.map((prob, idx) => (
                        <div key={idx} className="flex items-center justify-between">
                          <span className="text-sm">{prob.rarity}</span>
                          <div className="flex items-center gap-2 flex-1 max-w-[200px] ml-4">
                            <Progress value={prob.chance} className="h-2" />
                            <span className="text-sm font-medium w-12 text-right">{prob.chance}%</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-4 border-t border-border">
                      <Button
                        onClick={() => handleOpenCase(caseData)}
                        className="w-full gold-gradient hover:glow-gold-strong transition-all font-semibold text-lg h-12"
                      >
                        <Icon name="ShoppingCart" className="mr-2" size={20} />
                        Открыть за {caseData.price} ₽
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="profile" className="space-y-8 animate-fade-in">
            <div className="text-center space-y-4">
              <h2 className="text-5xl font-bold gold-text">Личный кабинет</h2>
              <p className="text-muted-foreground text-lg">Ваша коллекция и история открытий</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="Package" className="text-primary" size={24} />
                    Моя коллекция
                  </CardTitle>
                  <CardDescription>Всего предметов: {userInventory.length}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {userInventory.map((item, idx) => (
                      <Card key={idx} className="bg-muted/50 border-border hover:border-primary transition-all">
                        <CardContent className="p-4 text-center space-y-2">
                          <div className="text-5xl">{item.image}</div>
                          <p className="font-medium text-sm">{item.name}</p>
                          <Badge className={rarityColors[item.rarity]}>{rarityLabels[item.rarity]}</Badge>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="History" className="text-primary" size={24} />
                    История открытий
                  </CardTitle>
                  <CardDescription>Последние {openHistory.length} открытий</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {openHistory.map((record, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border border-border"
                      >
                        <div className="flex items-center gap-3">
                          <div className="text-3xl">{record.item.image}</div>
                          <div>
                            <p className="font-medium text-sm">{record.item.name}</p>
                            <Badge className={`${rarityColors[record.item.rarity]} text-xs`}>
                              {rarityLabels[record.item.rarity]}
                            </Badge>
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {record.date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <Dialog open={isOpening || wonItem !== null} onOpenChange={() => setWonItem(null)}>
        <DialogContent className="bg-card border-border max-w-4xl">
          {isOpening ? (
            <div className="py-8 space-y-6">
              <DialogTitle className="text-3xl gold-text text-center">Открываем кейс...</DialogTitle>
              <div className="relative h-48 overflow-hidden bg-muted/20 rounded-lg">
                <div className="absolute top-0 left-1/2 w-1 h-full bg-primary z-20 -translate-x-1/2 shadow-[0_0_20px_rgba(212,175,55,0.8)]"></div>
                <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-card via-card/50 to-transparent z-10"></div>
                <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-card via-card/50 to-transparent z-10"></div>
                <div 
                  className="flex gap-4 h-full items-center absolute left-1/2"
                  style={{ 
                    transform: `translateX(calc(-50% - ${scrollOffset}px))`,
                    transition: 'transform 6.5s cubic-bezier(0.1, 0.6, 0.2, 1)'
                  }}
                >
                  {rouletteItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex-shrink-0 w-36 h-40 flex flex-col items-center justify-center bg-card rounded-xl border-2 border-border p-4 shadow-lg"
                    >
                      <div className="text-6xl mb-3">{item.image}</div>
                      <Badge className={`${rarityColors[item.rarity]} text-xs px-3 py-1`}>
                        {rarityLabels[item.rarity]}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
              <p className="text-muted-foreground text-center animate-pulse text-lg">🎰 Определяем ваш приз...</p>
            </div>
          ) : wonItem ? (
            <div className="text-center py-8 space-y-6 animate-scale-in">
              <div className="text-8xl animate-float">{wonItem.image}</div>
              <DialogTitle className="text-3xl gold-text">Поздравляем!</DialogTitle>
              <div className="space-y-2">
                <p className="text-xl font-semibold">{wonItem.name}</p>
                <Badge className={`${rarityColors[wonItem.rarity]} text-lg px-4 py-1`}>
                  {rarityLabels[wonItem.rarity]}
                </Badge>
              </div>
              <Button
                onClick={() => setWonItem(null)}
                className="gold-gradient hover:glow-gold-strong w-full h-12 text-lg font-semibold"
              >
                Забрать в коллекцию
              </Button>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;